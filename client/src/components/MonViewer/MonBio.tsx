import {type ReactNode, use, useContext, useEffect, useMemo} from "react";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {
    type APIPastTypes,
    getLocalGenus,
    getLocalName,
    getSpeciesFlavorText,
    getTypes
} from "../../utils/apiParsing.ts";
import type {PokeAPI} from "pokeapi-types";
import {LanguageContext} from "../../contexts/LanguageContext.tsx";
import {TypeLabel} from "../TypeLabel.tsx";

export default function MonBio({mon, monSpecies, monTypes}: { mon: PokeAPI.Pokemon, monSpecies: PokeAPI.PokemonSpecies, monTypes: PokeAPI.PokemonType[] }) {
    const versionContext = useContext(VersionContext)
    const languageContext = useContext(LanguageContext)
    const flavorText = useMemo(() => {
        console.log(languageContext)
        try {
            return getSpeciesFlavorText(monSpecies.flavor_text_entries, versionContext.version, languageContext.language).flavor_text
        } catch (e) {
            try {
                return getSpeciesFlavorText(monSpecies.flavor_text_entries, versionContext.version, languageContext.language, true).flavor_text
            } catch (e) {
                try {
                    return getSpeciesFlavorText(monSpecies.flavor_text_entries, versionContext.version, languageContext.fallbackLanguage, true).flavor_text
                } catch (e) {
                    return "..."
                }
            }
        }
    }, [monSpecies, languageContext.language, versionContext.version]);

    const genus = useMemo(() => {
        try {
            return getLocalGenus(monSpecies.genera, languageContext.language, languageContext.fallbackLanguage)
        } catch (e) {
            return "";
        }
    }, [monSpecies, languageContext.language, languageContext.fallbackLanguage])

    if (!mon || !monSpecies) return null;

    return (
        <div className={"flex flex-col gap-5 items-center text-black"}>
            <div className={"flex flex-col py-2 px-5 bg-white"}>
                <h1 className={"text-5xl  font-bold"}>
                {getLocalName(monSpecies.names, languageContext.language)}
            </h1>
                {genus ?
                    <span className={"italic opacity-50"}>{genus}</span>
                    : null
                }
            </div>
            <div className={"flex g-2"}>
                {monTypes.map((type): ReactNode => {
                    return <TypeLabel pokeType={type.type.name} key={type.type.name}></TypeLabel>
                })}
            </div>
            <p className={"flex flex-col bg-white p-3 text-black w-lg"}>
                <span>
                    {flavorText}
                </span>
            </p>
        </div>
    )
}