import {type FormEvent, useContext, useRef, useState} from 'react'
import {supportedVersionGroups} from "../versionData.tsx";
import {VersionContext} from "./contexts/VersionContext.tsx";
import type {PokeAPI} from "pokeapi-types";
import {Pokedex} from "pokeapi-js-wrapper";
import VersionPicker from "./components/VersionPicker.tsx";
import {Link, Outlet} from "react-router-dom";
import LanguagePicker from "./components/LanguagePicker.tsx";

const dex = new Pokedex();

function App() {
    const versionContext = useContext(VersionContext)
    const [selectedMon, setSelectedMon] = useState<PokeAPI.Pokemon | null>(null);
    const [selectedMonSpecies, setSelectedMonSpecies] = useState<PokeAPI.PokemonSpecies | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);


    return (
        <>
            <header className={"z-100 sticky top-0 p-3 text-white gap-2 bg-slate-800 flex items-center max-w-screen"}>
                <Link to={"/"}><h1 className={"text-3xl font-black"}>Dex</h1></Link>
                <div className={"flex gap-3 w-full"}>
                    <VersionPicker/>
                    <LanguagePicker/>
                </div>
            </header>
            <div className={"relative h-full w-full"}>
                <main className={"bg-gray-100 flex flex-col gap-3 h-full w-full items-center py-15 px-3 md:px-10 text-black"}>
                    <Outlet></Outlet>
                </main>
                {/*<div className={"z-0 fixed hidden h-full w-4/5 top-0 bg-transparent flex flex-col py-20"}>*/}
                {/*    <VersionPicker/>*/}
                {/*    <LanguagePicker/>*/}
                {/*</div>*/}
            </div>
            <footer className={"flex justify-end bg-slate-800 px-10 py-3 text-white h-max-20"}>
                <span>Powered by <a className={"font-bold hover:underline"} href={"https://pokeapi.co"}>PokeApi</a></span>
            </footer>
        </>

    )
}

export default App
