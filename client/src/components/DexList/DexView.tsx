import {type FormEvent, type ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import DexList from "./DexList.tsx";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import type {PokeAPI} from "pokeapi-types";
import DexButton from "./DexButton.tsx";
import DiceIcon from "../../icon/dice-5.svg?react"
import SearchIcon from "../../icon/magnify.svg?react"

export function DexView(): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const [activeDex, setActiveDex] = useState<PokeAPI.Pokedex | null>(null)
    const monSearchInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!versionContext.pokedexes.length || !versionContext.nationalDex) {
            return
        }
        setActiveDex(versionContext.nationalDex)
    }, [versionContext.pokedexes, versionContext.nationalDex]);


    const randomMon = useCallback(() => {
        if (!versionContext.nationalDex) {
            return
        }
        const rand = Math.floor(Math.random() * versionContext.nationalDex.pokemon_entries.length);
        const name =  versionContext.nationalDex.pokemon_entries[rand].pokemon_species.name;
        window.location.href = `/mon/${name}`
    }, [versionContext.nationalDex])

    const searchMon = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (monSearchInput.current && monSearchInput.current.value) {
            window.location.href = `/mon/${monSearchInput.current.value}`
        }

    }, [])

    if (!versionContext.nationalDex) {
        return null
    }

    return (
        <div className={"flex flex-col gap-4 w-full md:max-w-xl "}>
            <div className={"flex flex-col items-center gap-4"}>
                <h1 className={"font-bold text-5xl"}>Pokedex</h1>

                <form onSubmit={(e) => {searchMon(e)}} className={"flex gap-2 overflow-hidden rounded-md items-stretch bg-slate-700 text-white p-2"}>
                    <input ref={monSearchInput} name="mon-name" className={"bg-white p-2 rounded-md text-black"} placeholder={"search for a Pokémon"} />
                    <button type="submit" className={"fill-white [&_svg]:size-6 hover:bg-slate-800 px-2 py-1 rounded-lg"}><SearchIcon/></button>
                </form>
                <button onClick={randomMon} className={"group flex gap-3 bg-slate-700 hover:bg-slate-800 px-6 py-4 rounded-md text-white cursor-pointer self-center mb-2 items-center"}>
                    <div className="size-5 fill-white group-hover:animate-[spin_250ms_ease-in-out]"><DiceIcon/></div>Random Pokémon!            </button>


                <div className={"flex justify-center flex-wrap max-w-2/3 gap-1 px-3 min-h-auto m-3"}><DexButton pdex={versionContext.nationalDex} setDex={setActiveDex} selected={activeDex === versionContext.nationalDex}/>
                    {versionContext.pokedexes.map((pdex, index) => {
                        return <DexButton key={index} pdex={pdex} setDex={setActiveDex} selected={activeDex === pdex}/>;
                    })}</div>
            </div>
            <DexList pokedex={activeDex}/>
        </div>
    )
}