import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {getLocalName, getTypes} from "../../utils/apiParsing.ts";
import type {PokeAPI} from "pokeapi-types";
import {LanguageContext} from "../../contexts/LanguageContext.tsx";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import dex from "../../utils/dex.tsx"
import {TypeLabel} from "../TypeLabel.tsx";
import type {MonPlusSpecies} from "./DexList.tsx";
import {type PokemonTypeName, typesBorder, typesBorderHover} from "../../utils/typePalettes.tsx";
import {Link} from "react-router-dom";

export function MonListItem({monPlusSpecies, dexNum}: { monPlusSpecies: MonPlusSpecies, dexNum: number }): JSX.Element {
    // const [monObject, setMonObject] = useState<null | PokeAPI.Pokemon>(null)
    const languageContext = useContext(LanguageContext);
    const versionContext = useContext(VersionContext);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // useEffect(() => {
    //     (async () => {
    //        dex.getPokemonByName(monPlusSpecies.name).then((mon) => setMonObject(mon))
    //     })()
    // }, [monPlusSpecies]);

    const name = useMemo(() => {
        return getLocalName(monPlusSpecies.species.names, languageContext.language, languageContext.fallbackLanguage)

    }, [monPlusSpecies, languageContext]);

    const types = useMemo(() => {
        if (!monPlusSpecies) {
            return []
        }
        return getTypes(monPlusSpecies.mon.types, monPlusSpecies.mon.past_types, versionContext.versionDetails.generation)
    }, [monPlusSpecies, versionContext.versionDetails.generation])

    useEffect(() => {
        let sprite = monPlusSpecies.mon.sprites.versions["generation-viii"]["icons"]["front_default"] as string;
        if (!sprite) {
            sprite = monPlusSpecies.mon.sprites.front_default
        }
        if (imageRef.current) {
            imageRef.current.src = sprite;
        }
    }, [monPlusSpecies]);

    if (!monPlusSpecies) {
        return null
    }


    const type = types[0].type.name;
    const border = typesBorderHover[type as PokemonTypeName];

    return (
        <Link to={`/mon/${monPlusSpecies.mon.name}`}>
            <div
                className={`flex gap-1 bg-white hover:bg-gray-50 border-white ${border} border-l-5  p-1 items-center animate-all transition-colors duration-50`}>
                <div className={"size-15"}>
                    <div className={"absolute items-center justify-center size-15"}>
                        <img
                            className={"pixel-image relative h-full w-full right-1 bottom-1"}
                            ref={imageRef} src={null}/>
                    </div>
                </div>
                <span className={"mr-2 rounded-md p-1 bg-gray-50"}>#{dexNum}</span>
                <span className={"font-bold text-lg"}>{name}</span>
                <div className={"flex flex-col gap-1 ml-auto self-start"}>
                    {types.map((type) => (
                        <TypeLabel pokeType={type.type.name} size={"sm"}/>
                    ))}
                </div>
            </div>
        </Link>
    )

}