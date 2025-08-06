import {useContext, useEffect} from "react";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {getLocalName} from "../../utils/apiParsing.ts";
import type {PokeAPI} from "pokeapi-types";
import {LanguageContext} from "../../contexts/LanguageContext.tsx";

export default function MonBio({mon, monSpecies}: {mon: PokeAPI.Pokemon, monSpecies: PokeAPI.PokemonSpecies}) {
    const versionContext = useContext(VersionContext)
    const languageContext = useContext(LanguageContext)

    if (!mon || !monSpecies) return null;


    return (
        <>
            <div>
                {getLocalName(monSpecies.names, languageContext.language)}
            </div>
        </>
    )
}