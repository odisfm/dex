import {type ReactElement, useCallback, useContext, useEffect, useState} from "react";
import DexList from "./DexList.tsx";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import type {PokeAPI} from "pokeapi-types";
import DexButton from "./DexButton.tsx";
import DiceIcon from "../../icon/dice-5.svg?react"

export function DexView(): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const [activeDex, setActiveDex] = useState<PokeAPI.Pokedex | null>(null)

    useEffect(() => {
        if (!versionContext.pokedexes.length) {
            return
        }
        setActiveDex(versionContext.pokedexes[0])
    }, [versionContext.pokedexes]);


    const randomMon = useCallback(() => {
        if (!versionContext.nationalDex) {
            return
        }
        const rand = Math.floor(Math.random() * versionContext.nationalDex.pokemon_entries.length);
        const name =  versionContext.nationalDex.pokemon_entries[rand].pokemon_species.name;
        window.location.href = `/mon/${name}`
    }, [versionContext.nationalDex])

    if (!versionContext.nationalDex) {
        return null
    }

    return (
        <div className={"flex flex-col gap-4 w-full md:max-w-xl "}>
            <div className={"flex flex-col items-center gap-2 mb-4"}>
                <h1 className={"font-bold text-3xl"}>Pokedex</h1>

                <div className={"flex justify-center flex-wrap max-w-2/3 gap-1 px-3 min-h-auto"}><DexButton pdex={versionContext.nationalDex} setDex={setActiveDex} selected={activeDex === versionContext.nationalDex}/>
                    {versionContext.pokedexes.map((pdex, index) => {
                        return <DexButton key={index} pdex={pdex} setDex={setActiveDex} selected={activeDex === pdex}/>;
                    })}</div>
            </div>
            <button onClick={randomMon} className={"group flex gap-3 bg-slate-700 hover:bg-slate-800 px-6 py-4 rounded-md text-white cursor-pointer self-center mb-2 items-center"}>
                <div className="size-5 fill-white group-hover:animate-[spin_250ms_ease-in-out]"><DiceIcon/></div>Random Pokemon!            </button>

            <DexList pokedex={activeDex}/>
        </div>
    )
}