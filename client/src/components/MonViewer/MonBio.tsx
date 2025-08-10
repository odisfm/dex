import {type ReactNode, useContext, useEffect, useMemo, useState} from "react";
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
import dex from "../../utils/dex.tsx"

export default function MonBio({mon, monSpecies, monTypes, variantForms}:
{ mon: PokeAPI.Pokemon, monSpecies: PokeAPI.PokemonSpecies, monTypes: PokeAPI.PokemonType[], variantForms: PokeAPI.PokemonForm[] }) {
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


    let displayName;

    variantForms.forEach(form => {
        try {

            if (mon.name === form.name) {
                displayName = getLocalName([...form.names, ...form.form_names], languageContext.language)
            }
        } catch (e) {
            // console.error(e)
        }
    })

    if (!displayName) {
        try {
            displayName = getLocalName(monSpecies.names, languageContext.language);
        } catch (e) {
            displayName = monSpecies.name
        }
    }


    return (

        <div className={"flex flex-col gap-5 items-center text-black "}>

                <div className={"flex flex-col py-1 px-10 bg-white items-center text-2xl"}>
                    <span className={"absolute self-end font-bold opacity-65"}>
                    #{monSpecies.id}
                    </span>

                    <h1 className={"md:text-6xl text-3xl mt-6 font-bold ml-3 mr-3 text-center max-w-lg"}>
                        {displayName}
                    </h1>
                    {genus ?
                        <span className={"italic opacity-50 text-lg"}>{genus}</span>
                        : null
                    }

                </div>
            <div className={"flex gap-2"}>
                {monTypes.map((type): ReactNode => {
                    return <TypeLabel pokeType={type.type.name} key={type.type.name}></TypeLabel>
                })}
            </div>
            <p className={"flex flex-col bg-white py-5 px-7 text-black max-w-lg text-center italic"}>
                <span>
                    {flavorText}
                </span>
            </p>

        </div>

    )
}