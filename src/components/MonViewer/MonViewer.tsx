import {type ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import type {PokeAPI} from "pokeapi-types";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import MonSprite from "./Sprite/MonSprite.tsx";
import MonBio from "./MonBio.tsx";
import dex from "../../utils/dex.tsx";
import {compareVersionGroupToGen, getVersionGroupGeneration} from "../../utils/util.ts";
import {type APIPastTypes, getTypes} from "../../utils/apiParsing.ts";
import MonVariants from "./MonVariants.tsx";
import MonPrevNextButton from "./MonPrevNextButton.tsx";
import MovMoveList from "./MonMoveList.tsx";
import MonBattleDetails from "./BattleDetails/MonBattleDetails.tsx";
import Spinner from "../Spinner.tsx";

export default function MonViewer(): ReactElement {
    const versionContext = useContext(VersionContext);
    const [selectedMon, setSelectedMon] = useState<PokeAPI.Pokemon | null>(null)
    const [selectedSpecies, setSelectedSpecies] = useState<PokeAPI.PokemonSpecies | null>(null)
    const {monName} = useParams()
    const [adjacentMon, setAdjacentMon] = useState<[string, string] | null>(null)
    const [monVariants, setMonVariants] = useState<PokeAPI.Pokemon[]>([])
    const [monVariantForms, setMonVariantForms] = useState<PokeAPI.PokemonForm[]>([])
    const [firstLoad, setFirstLoad] = useState<boolean>(false)

    const currentMonNameRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        window.location.href = "#"
    }, []);

    const fetchPokemon = useCallback(async () => {
        if (!monName || monName === currentMonNameRef.current) {
            return;
        }
        currentMonNameRef.current = monName;

        let newMon: PokeAPI.Pokemon | null = null
        try {
            newMon = await dex.getPokemonByName(monName) as PokeAPI.Pokemon;
        } catch (e) {
            try {
                const search = await dex.getPokemonSpeciesByName(monName) as PokeAPI.PokemonSpecies;
                let replacement = false;
                for (const variety of search.varieties) {
                    if (variety.is_default) {
                        newMon = await dex.getPokemonByName(variety.pokemon.name) as PokeAPI.Pokemon
                        replacement = true;
                        break;
                    }
                }
                if (!replacement) {
                    // noinspection ExceptionCaughtLocallyJS
                    throw e

                }
            } catch (e) {
                if (e.code === "ERR_BAD_REQUEST") {
                    window.location.href = "/404"
                }
                console.log(e)
            }
        }

        if (!newMon) return;

        setSelectedMon(newMon);
        const species = await dex.getPokemonSpeciesByName(newMon.species.name) as PokeAPI.PokemonSpecies;
        setSelectedSpecies(species);
        let thisForm: PokeAPI.PokemonForm;
        try {
            thisForm = await dex.getPokemonFormByName(newMon.name) as PokeAPI.PokemonForm;
        } catch  {
            try {
                thisForm = await dex.getPokemonFormByName(newMon.name + "-normal") as PokeAPI.PokemonForm;
            } catch {
                return window.location.href = "/404"
            }
        }

        const compare = compareVersionGroupToGen(thisForm.version_group.name, versionContext.versionDetails.generation);
        versionContext.setRestrictGeneration(getVersionGroupGeneration(thisForm.version_group.name));

        if (compare > 0) {
            versionContext.setVersionGroup(thisForm.version_group.name)
        }
        setFirstLoad(true);
    }, [monName, versionContext]);

    useEffect(() => {
        if (monName !== currentMonNameRef.current) {
            fetchPokemon().then(() => {
            });
        }
    }, [fetchPokemon, monName]);

    useEffect(() => {
        let isCancelled = false;

        (async () => {
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
                if (isCancelled) return;

                const varObj = await dex.getPokemonByName(variety.pokemon.name) as PokeAPI.Pokemon;
                const formObj = await dex.getPokemonFormByName(varObj.forms[0].name);
                const compare = compareVersionGroupToGen(formObj.version_group.name, versionContext.versionDetails.generation)
                if (compare <= 0) {
                    variantObjs.push(varObj)
                    formList.push(formObj)
                }
            }

            if (!isCancelled) {
                setMonVariantForms(formList)
                setMonVariants(variantObjs)
            }
        })()

        return () => {
            isCancelled = true;
        };
    }, [selectedMon, selectedSpecies, versionContext.versionDetails.generation]);

    const restrictionGeneration = useMemo(() => {
        return selectedSpecies?.generation.name || null;
    }, [selectedSpecies?.generation.name]);

    useEffect(() => {
        if (!restrictionGeneration) {
            return
        }
        versionContext.setRestrictGeneration(restrictionGeneration);

        return () => {
            versionContext.setRestrictGeneration(null);
        }
    }, [restrictionGeneration, versionContext]);

    const adjacentMonMemo = useMemo(() => {
        if (!selectedMon || !versionContext.nationalDex) {
            return null;
        }
        const speciesName = selectedMon.species.name
        let prev: string | undefined, next: string | undefined;
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
        return [prev, next] as [string, string];
    }, [selectedMon, versionContext.nationalDex]);

    useEffect(() => {
        setAdjacentMon(adjacentMonMemo);
    }, [adjacentMonMemo]);

    const monTypes = useMemo(() => {
        if (!selectedMon) return [];
        return getTypes(
            selectedMon.types,
            (selectedMon as unknown as { past_types: APIPastTypes[] }).past_types,
            versionContext.versionDetails.generation
        );
    }, [selectedMon, versionContext.versionDetails.generation]);

    const prevUrl = useMemo(() => adjacentMon?.[0] ? "/mon/" + adjacentMon[0] : null, [adjacentMon?.[0]]);
    const nextUrl = useMemo(() => adjacentMon?.[1] ? "/mon/" + adjacentMon[1] : null, [adjacentMon?.[1]]);

    if (!firstLoad || !selectedMon || !selectedSpecies) {
        return (
            <Spinner/>
        )
    }

    return (
        <div className={"flex flex-col gap-7 items-center lg:w-4/5 text-black mt-5"}>
            <div className={"flex flex-wrap items-center justify-center gap-10"}>
                <div className={"hidden md:block min-w-14"}>
                    {prevUrl ?
                        <div className={"hidden md:block"}><MonPrevNextButton left={true} url={prevUrl}/>
                        </div> : null}</div>
                <MonSprite mon={selectedMon} monSpecies={selectedSpecies} monTypes={monTypes}></MonSprite>
                <div className={"hidden md:block min-w-14"}>
                    {nextUrl ?
                        <div className={"hidden md:block"}><MonPrevNextButton left={false} url={nextUrl}/></div> : null}
                </div>
            </div>
            {
                prevUrl ?
                    <div className={"flex gap-2  md:hidden"}>
                        <div><MonPrevNextButton left={true} url={prevUrl || ""}/></div>
                        <div><MonPrevNextButton left={false} url={nextUrl || ""}/></div>
                    </div>
                    : null
            }
            <MonVariants monSpecies={selectedSpecies} mon={selectedMon} monVariants={monVariants}/>
            <div className={"flex gap-2"}>
                <MonBio mon={selectedMon} monSpecies={selectedSpecies} monTypes={monTypes}
                        variantForms={monVariantForms}></MonBio>
            </div>
            <MonBattleDetails mon={selectedMon}/>
            <MovMoveList mon={selectedMon}/>
        </div>
    )
}