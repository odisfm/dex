import {type FormEvent, useContext, useRef, useState} from 'react'
import {supportedVersionGroups} from "../versionData.tsx";
import {VersionContext} from "./contexts/VersionContext.tsx";
import type {PokeAPI} from "pokeapi-types";
import {Pokedex} from "pokeapi-js-wrapper";
import VersionPicker from "./components/VersionPicker.tsx";
import {Link, Outlet} from "react-router-dom";
import LanguagePicker from "./components/LanguagePicker.tsx";
import GithubIcon from "./icon/github.svg?react"

const dex = new Pokedex();

function App() {
    const versionContext = useContext(VersionContext)
    const [selectedMon, setSelectedMon] = useState<PokeAPI.Pokemon | null>(null);
    const [selectedMonSpecies, setSelectedMonSpecies] = useState<PokeAPI.PokemonSpecies | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);


    return (
        <>
            <header className={"z-100 sticky top-0 p-3 text-white gap-2 md:gap-10 bg-slate-800 flex items-center max-w-screen"}>
                <Link to={"/"}><h1 className={"text-3xl font-black"}>Dex</h1></Link>
                <div className={"flex gap-3 w-full"}>
                    <VersionPicker/>
                    <LanguagePicker/>
                </div>
            </header>
            <div className={"relative h-full w-full"}>
                <main className={"bg-gray-100 flex flex-col gap-3 h-full w-full min-h-screen items-center py-5 px-3 md:px-10 text-black"}>
                    <Outlet></Outlet>
                </main>
            </div>
            <footer className={"flex bg-slate-800 px-10 py-3 text-white h-max-20 items-center"}>
                <Link to={"https://github.com/odisfm/dex"} className={"group rounded-md px-3 py-1 hover:bg-slate-900"}>
                <span className={"flex gap-2 fill-white"}>
                    <div className={"size-6 "}><GithubIcon/></div>
                    View source
                </span>
                </Link>
                <span className={"ml-auto"}>Powered by <a className={"font-bold hover:underline"} href={"https://pokeapi.co"}>PokeApi</a></span>
            </footer>
        </>

    )
}

export default App
