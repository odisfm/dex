import {type ReactElement, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import type { PokeAPI} from "pokeapi-types";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import MonSprite from "./MonSprite.tsx";
import MonBio from "./MonBio.tsx";
import dex from "../../utils/dex.tsx";
import {compareVersionGroupToGen, getVersionGroupGeneration} from "../../utils/util.ts";
import MonVariants from "./MonVariants.tsx";
import MonPrevNextButton from "./MonPrevNextButton.tsx";

export default function MonViewer(): ReactElement {
    const versionContext = useContext(VersionContext);
    const [selectedMon, setSelectedMon] = useState<PokeAPI.Pokemon | null>(null)
    const [selectedSpecies, setSelectedSpecies] = useState<PokeAPI.PokemonSpecies | null>(null)
    const {monName} = useParams()
    const [adjacentMon, setAdjacentMon] = useState<[string, string] | null>(null)
    const [monVariants, setMonVariants] = useState<PokeAPI.Pokemon[]>([])
    const [monVariantForms, setMonVariantForms] = useState<PokeAPI.PokemonForm[]>([])

    const fetchPokemon = useCallback(async () => {
        if (!monName) {
            return;
        }
        let newMon: PokeAPI.Pokemon | null = null
        try {
            newMon = await dex.getPokemonByName(monName) as PokeAPI.Pokemon;
        } catch (e) {
            try {
                const search = await dex.getPokemonSpeciesByName(monName) as PokeAPI.PokemonSpecies;
                for (const variety of search.varieties) {
                    if (variety.is_default) {
                         newMon = await dex.getPokemonByName(variety.pokemon.name)
                    }
                }
            } catch (e) {
                console.error(e)
            }
        }
        setSelectedMon(newMon);
        const species = await dex.getPokemonSpeciesByName(newMon.species.name) as PokeAPI.PokemonSpecies;
        setSelectedSpecies(species);
        const thisForm = await dex.getPokemonFormByName(newMon.name)
        console.log("thisForm", thisForm)
        const compare = compareVersionGroupToGen(thisForm.version_group.name, versionContext.versionDetails.generation);
        console.log(`first appearance later than set gen? ${compare < 0}`)
        if (compare > 0) {
            versionContext.setVersionGroup(thisForm.version_group.name)
        }

    }, [monName, versionContext])

    useEffect(() => {
        fetchPokemon().then(() => {});
    }, [fetchPokemon, monName]);

    useEffect(() => {
        (async ()=>  {
            if (!selectedMon || !selectedSpecies) {
                return;
            }
            if (selectedSpecies.name !== selectedMon.species.name) {
                return;
            }
            const varieties = selectedSpecies.varieties;

            const variantObjs: PokeAPI.Pokemon[] = [];
            const formList: PokeAPI.PokemonForm[] = [];
            for (const variety of varieties) {
                const varObj = await dex.getPokemonByName(variety.pokemon.name) as PokeAPI.Pokemon;
                const formObj = await dex.getPokemonFormByName(varObj.forms[0].name);
                const compare = compareVersionGroupToGen(formObj.version_group.name, versionContext.versionDetails.generation)
                if (compare <= 0) {
                    variantObjs.push(varObj)
                    formList.push(formObj)
                }
            }
            setMonVariantForms(formList)
            setMonVariants(variantObjs)
            console.log(`forms for mon ${selectedMon.name}`, variantObjs)

        })()
    }, [selectedMon, selectedSpecies, versionContext.versionDetails ]);

    useEffect(() => {
        if (!selectedSpecies) {
            return
        }
        versionContext.setRestrictGeneration(selectedSpecies.generation.name);
        console.log(`restricted gen to ${selectedSpecies.generation.name}`)

        return () => {
            versionContext.setRestrictGeneration(null);
        }


    }, [selectedSpecies, versionContext]);

    useEffect(() => {
        if (!selectedMon || !versionContext.nationalDex) {
            return;
        }
        const speciesName = selectedMon.species.name
        let prev, next: string;
        let found = false;

        for (const mon of versionContext.nationalDex.pokemon_entries) {
            const name = mon.pokemon_species.name;

            if (found) {
                next = name;
                break;
            }

            if (name === speciesName) {
                found = true;
            } else {
                prev = name;
            }
        }
        setAdjacentMon([prev, next])

    }, [selectedMon, versionContext.nationalDex]);

    const monTypes = useMemo(() => {
        if (!selectedMon) return [];
        return getTypes(
            selectedMon.types,
            (selectedMon as any).past_types as PokeAPI.PokemonType[],
            versionContext.versionDetails.generation
        );
    }, [selectedMon, versionContext.versionDetails]);

    if (!selectedMon || !selectedSpecies ) {
        return <h1 className={"text-white text-3xl"}>{`Could not fetch "${monName}"`}</h1>
    }

    return (
        <div className={"flex flex-col gap-7 items-centertext-white"}>
            <div className={"flex items-center justify-center gap-10"}>
                {adjacentMon ? <MonPrevNextButton left={true} url={"/mon/" + adjacentMon[0]}/> : null}
                <MonSprite mon={selectedMon} monSpecies={selectedSpecies} monTypes={monTypes}></MonSprite>
                {adjacentMon ? <MonPrevNextButton left={false} url={"/mon/" + adjacentMon[1]}/> : null}
            </div>
            <MonVariants monSpecies={selectedSpecies} mon={selectedMon} monVariants={monVariants}/>
            <div className={"flex gap-2"}>
                <MonBio mon={selectedMon} monSpecies={selectedSpecies} monTypes={monTypes} variantForms={monVariantForms}></MonBio>
            </div>
            <div className={"text-lg text-white"}>
                {/*{JSON.stringify(selectedMon)}*/}
            </div>
        </div>
    )
}