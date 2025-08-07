import {type ReactElement, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Pokedex} from "pokeapi-js-wrapper";
import {useParams} from "react-router-dom";
import {PokeAPI} from "pokeapi-types";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import MonSprite from "./MonSprite.tsx";
import MonBio from "./MonBio.tsx";
import dex from "../../utils/dex.tsx";
import {compareGenerations} from "../../utils/util.ts";
import {getTypes} from "../../utils/apiParsing.ts";

export default function MonViewer(): ReactElement {
    const versionContext = useContext(VersionContext);
    const [selectedMon, setSelectedMon] = useState<PokeAPI.Pokemon | null>(null)
    const [selectedSpecies, setSelectedSpecies] = useState<PokeAPI.PokemonSpecies | null>(null)
    const {monName} = useParams()

    const fetchPokemon = useCallback(async () => {
        if (!monName) {
            return;
        }
        const search = await dex.getPokemonByName(monName) as PokeAPI.Pokemon;
        setSelectedMon(search);
        const species = await dex.getPokemonSpeciesByName(search.species.name) as PokeAPI.PokemonSpecies;
        setSelectedSpecies(species);
        const firstGen = species.generation.name
        const compare = compareGenerations(versionContext.versionDetails.generation, firstGen);
        if (compare < 0) {
            versionContext.setGeneration(firstGen)
        }

    }, [monName, versionContext])

    useEffect(() => {
        fetchPokemon().then(() => {});
    }, [fetchPokemon, monName]);

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
        <div className={"flex flex-col gap-3 items-center text-white"}>
            <MonSprite mon={selectedMon} monTypes={monTypes}></MonSprite>
            <MonBio mon={selectedMon} monSpecies={selectedSpecies} monTypes={monTypes}></MonBio>
            <div className={"text-lg text-white"}>
                {/*{JSON.stringify(selectedMon)}*/}
            </div>
        </div>
    )
}