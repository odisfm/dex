import {type FormEvent, useContext, useRef, useState} from 'react'
import {supportedVersionGroups} from "../versionData.tsx";
import {VersionContext} from "./contexts/VersionContext.tsx";
import type {PokeAPI} from "pokeapi-types";
import {Pokedex} from "pokeapi-js-wrapper";
import VersionChooser from "./components/VersionChooser.tsx";
import {Outlet} from "react-router-dom";
import LanguageChooser from "./components/LanguageChooser.tsx";

const dex = new Pokedex();

function App() {
    const versionContext = useContext(VersionContext)
    const [selectedMon, setSelectedMon] = useState<PokeAPI.Pokemon | null>(null);
    const [selectedMonSpecies, setSelectedMonSpecies] = useState<PokeAPI.PokemonSpecies | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);


    return (
        <>
            <header>
                Dex
            </header>
            <main>
                <VersionChooser />
                <LanguageChooser />
                <Outlet></Outlet>
            </main>
        </>

    )
}

export default App
