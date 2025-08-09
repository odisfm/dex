import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useContext, useEffect, useState} from "react";
import dex from "../../utils/dex"
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {MonListItem} from "./MonListItem.tsx";
import DexButton from "./DexButton.tsx";

const PER_PAGE = 15

export type MonPlusSpecies = {
    mon: PokeAPI.Pokemon,
    species: PokeAPI.PokemonSpecies,
}

export default function DexList({pokedex}: {pokedex: PokeAPI.Pokedex | null}): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const [loadedMon, setLoadedMon] = useState<MonPlusSpecies[]>([]);
    const [numLoaded, setNumLoaded] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        setLoadedMon([])
        setPage(0)
    }, [pokedex]);


    useEffect(() => {
        const fetchMoreMon = async () => {
            if (!pokedex) {
                return;
            }
            const toFetch: string[] = [];
            const startIndex = PER_PAGE * page
            const endIndex = PER_PAGE * (page + 1)
            pokedex.pokemon_entries.slice(startIndex, endIndex).forEach(entry => {
                toFetch.push(entry.pokemon_species.url)
            })
            const fetchedSpecies: PokeAPI.PokemonSpecies[] = await dex.resource(toFetch)
            let fetchedMon: PokeAPI.Pokemon[] = [];
            const monUrl = fetchedSpecies.map((spec) => {
                return spec.varieties[0].pokemon.url
            })
            fetchedMon = await dex.resource(monUrl) as PokeAPI.Pokemon[]
            const monPlusSpecies: MonPlusSpecies[] = [];

            for (let i = 0; i < fetchedSpecies.length; i++) {
                monPlusSpecies.push({
                    mon: fetchedMon[i],
                    species: fetchedSpecies[i],
                })
            }
            console.log(fetchedSpecies)
            console.log(fetchedMon)
            setLoadedMon(prevLoadedMon => [...prevLoadedMon, ...monPlusSpecies])
        }
        fetchMoreMon();
    }, [page, pokedex])

    return (
        <div className={"flex flex-col items-center justify-center"}>

            <div className={"flex flex-col gap-1 w-lg"}>
                {loadedMon.map((mon, index) => {
                    return <MonListItem monPlusSpecies={mon} dexNum={index} key={index}/>;
                })}
            </div>
        </div>
    )

}