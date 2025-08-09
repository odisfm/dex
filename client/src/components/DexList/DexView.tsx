import {type ReactElement, useContext, useEffect, useState} from "react";
import DexList from "./DexList.tsx";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import type {PokeAPI} from "pokeapi-types";
import DexButton from "./DexButton.tsx";

export function DexView(): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const [activeDex, setActiveDex] = useState<PokeAPI.Pokedex | null>(null)

    useEffect(() => {
        if (!versionContext.pokedexes.length) {
            return
        }
        setActiveDex(versionContext.pokedexes[0])
    }, [versionContext.pokedexes]);

    if (!versionContext.nationalDex) {
        return null
    }



    return (
        <>
            <div className={"flex flex-col items-center gap-2"}>
                <h1 className={"font-bold text-3xl"}>Pokedex</h1>
                <div className={"flex justify-center flex-wrap size-2/3 gap-1"}><DexButton pdex={versionContext.nationalDex} setDex={setActiveDex} selected={activeDex === versionContext.nationalDex}/>
                    {versionContext.pokedexes.map((pdex) => {
                        return <DexButton pdex={pdex} setDex={setActiveDex} selected={activeDex === pdex}/>;
                    })}</div>
            </div>
            <div className={"h-screen"}>
                <DexList pokedex={activeDex}/>
            </div>
        </>
    )
}