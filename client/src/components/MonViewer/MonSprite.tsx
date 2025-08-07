import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {getSprites} from "../../utils/apiParsing.ts";
import {
    typePalettesDark,
    typePalettesMid, typesBorder,
    typesBorderHover,
    typesGradientDouble,
    typesGradientEnd,
    typesGradientStart
} from "../../utils/typePalettes.tsx";
import {compareGenerations} from "../../utils/util.ts";
import ShinyButton from "./ShinyButton.tsx";

export default function MonSprite({mon, monTypes}: {mon:PokeAPI.Pokemon, monTypes:PokeAPI.PokemonType[]}): ReactElement {
    const [activeSprite, setActiveSprite] = useState<"string" | null>(null);
    const versionContext = useContext(VersionContext)
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [shiny, setShiny] = useState<boolean>(false);

    useEffect(() => {
        if (!mon || !imageRef.current) {
            return;
        }
        let sprites;
        try {
            sprites = getSprites(mon.sprites, versionContext.versionDetails.generation, versionContext.versionDetails.versionGroup, versionContext.versionDetails.version)
        } catch (e) {
            console.error(e)
        }
        if (sprites) {
            const key = shiny ? "front_shiny" : "front_default"
            imageRef.current.src = sprites[key]
        } else {
            imageRef.current.src = null as unknown as string;
        }
    }, [mon, versionContext, shiny]);

    const preGen3 = compareGenerations(versionContext.versionDetails.generation, "generation-iii") >= 0;

    let gradientStart = ""
    let gradientEnd = ""
    let borderClass;
    let borderHoverClass;
    let shadowClass

    if (preGen3) {
        gradientStart = typesGradientStart[monTypes[0].type.name as keyof typeof typesGradientStart];
        if (monTypes.length > 1) {
            gradientEnd = typesGradientEnd[monTypes[1].type.name]
        } else {
            gradientEnd = typesGradientDouble[monTypes[0].type.name]
        }

        borderClass = typesBorder[monTypes[0].type.name]
        borderHoverClass = typesBorderHover[monTypes[0].type.name]
        shadowClass = typePalettesDark[monTypes[0].type.name]
    } else {
        gradientStart = "from-white"
        gradientEnd = "to-white"
        borderClass = "border-gray-200"

    }

    const toggleShiny = useCallback(() => {
        setShiny(!shiny)
        console.log(`shiny ${shiny}`)
    }, [shiny])

    return (
        <div className={"flex justify-center items-center relative"}>
            <div
                className={`group relative overflow-hidden rounded-full h-60 w-60 flex items-center border-5 ${borderClass} ${borderHoverClass} animate-all duration-1000`}>
                <img
                    className="z-10 absolute left-3 pixel-image object-cover size-50 hover:saturate-120"
                    src={null}
                    ref={imageRef}
                />
                <div className={`z-9 absolute top-15 inset-0 h-80 w-100 ${shadowClass} opacity-10 rounded-full `}>

                </div>
                <div
                    className={`absolute inset-0 bg-radial ${gradientStart} ${gradientEnd}`}>
                </div>
                <div
                    className={`absolute inset-0  opacity-0 group-hover:opacity-60 group-hover:animate-[spin_4s_ease-in-out] transition-all duration-500 ease-in-out bg-radial-[at_25%_75%] ${gradientStart} ${gradientEnd}`}></div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                <ShinyButton isShiny={shiny} toggleShiny={toggleShiny} />
            </div>
        </div>
    )
}