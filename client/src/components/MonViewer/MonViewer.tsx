import {type ReactElement, useCallback, useContext, useEffect, useState} from "react";
import {Pokedex} from "pokeapi-js-wrapper";
import {useParams} from "react-router-dom";
import {PokeAPI} from "pokeapi-types";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import MonSprite from "./MonSprite.tsx";
import MonBio from "./MonBio.tsx";
import dex from "../../utils/dex.tsx";

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

    }, [monName])

    useEffect(() => {
        fetchPokemon().then(() => {console.log('fetched')});
    }, [fetchPokemon, monName]);

    if (!selectedMon || !selectedSpecies) {
        return <h1 className={"text-white text-3xl"}>{`Could not fetch "${monName}"`}</h1>
    }

    return (
        <div className={"text-white"}>
            <MonSprite mon={selectedMon}></MonSprite>
            <MonBio mon={selectedMon} monSpecies={selectedSpecies}></MonBio>
            <div className={"text-lg text-white"}>
                {/*{JSON.stringify(selectedMon)}*/}
            </div>
        </div>
    )
}