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
import MonPrevNextButton from "./MonPrevNextButton.tsx";

export default function MonBio({mon, monSpecies, monTypes, adjacentMon}:
{ mon: PokeAPI.Pokemon, monSpecies: PokeAPI.PokemonSpecies, monTypes: PokeAPI.PokemonType[], adjacentMon: [ string, string] }) {
    const versionContext = useContext(VersionContext)
    const languageContext = useContext(LanguageContext)
    const flavorText = useMemo(() => {
        try {
            return getSpeciesFlavorText(monSpecies.flavor_text_entries, versionContext.versionDetails.version, languageContext.language).flavor_text
        } catch (e) {
            try {
                return getSpeciesFlavorText(monSpecies.flavor_text_entries, versionContext.versionDetails.version, languageContext.language, true).flavor_text
            } catch (e) {
                try {
                    return getSpeciesFlavorText(monSpecies.flavor_text_entries, versionContext.versionDetails.version, languageContext.fallbackLanguage, true).flavor_text
                } catch (e) {
                    return "..."
                }
            }
        }
    }, [monSpecies, languageContext.language, languageContext.fallbackLanguage, versionContext.versionDetails.version]);

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
            <div className={"flex gap-2 items-center"}>
                {adjacentMon ? <MonPrevNextButton left={true} url={"/mon/" + adjacentMon[0]}/> : null}

                <div className={"flex flex-col py-2 px-5  bg-white gap-1 items-center"}>

                <span className={"absolute self-end font-bold opacity-55"}>
                    #{monSpecies.id}
                </span>
                    <h1 className={"text-5xl mt-3 font-bold ml-3 mr-3"}>
                        {getLocalName(monSpecies.names, languageContext.language)}
                    </h1>
                    {genus ?
                        <span className={"italic opacity-50"}>{genus}</span>
                        : null
                    }

                </div>
                {adjacentMon ? <MonPrevNextButton left={false} url={"/mon/" + adjacentMon[1]}/> : null}</div>

            <div className={"flex gap-2"}>
                {monTypes.map((type): ReactNode => {
                    return <TypeLabel pokeType={type.type.name} key={type.type.name}></TypeLabel>
                })}
            </div>
            <p className={"flex flex-col bg-white py-5 px-7 text-black max-w-lg text-center"}>
                <span>
                    {flavorText}
                </span>
            </p>

        </div>

    )
}