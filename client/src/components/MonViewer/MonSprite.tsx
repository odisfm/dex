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

export default function MonSprite({mon, monTypes}: {mon:PokeAPI.Pokemon, monTypes:PokeAPI.PokemonType[]}): ReactElement {
    const [activeSprite, setActiveSprite] = useState<"string" | null>(null);
    const versionContext = useContext(VersionContext)
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!mon || !imageRef.current) {
            return;
        }
        let sprites;
        try {
            sprites = getSprites(mon.sprites, versionContext.generation, versionContext.versionGroup, versionContext.version)
        } catch (e) {
            console.error(e)
        }
        if (sprites) {
            imageRef.current.src = sprites.front_default
        } else {
            imageRef.current.src = null as unknown as string;
        }
    }, [mon, versionContext]);

    let gradientStart = ""
    let gradientEnd = ""

    gradientStart = typesGradientStart[monTypes[0].type.name as keyof typeof typesGradientStart];
    if (monTypes.length > 1) {
        gradientEnd = typesGradientEnd[monTypes[1].type.name]
    } else {
        gradientEnd = typesGradientDouble[monTypes[0].type.name]
    }

    const bgClass = typePalettesMid[monTypes[0].type.name]
    const borderClass = typesBorder[monTypes[0].type.name]
    const borderHoverClass = typesBorderHover[monTypes[0].type.name]
    const shadowClass = typePalettesDark[monTypes[0].type.name]


    return (
        <div
            className={`group relative overflow-hidden rounded-full h-60 w-60 flex items-center border-5 ${borderClass} ${borderHoverClass} animate-all duration-1000`}>
            <img
                    className="z-10 absolute left-3 pixel-image object-scale-fill size-50 hover:saturate-120"
                    src={""}
                    ref={imageRef}
                />
            <div className={`z-9 absolute top-15 inset-0 h-80 w-100 ${shadowClass} opacity-10 rounded-full `}>

            </div>
            <div
                className={`absolute inset-0 bg-radial-[farthest-corner_at_50%_50%] ${gradientStart} ${gradientEnd} group-hover:animate-[spin_3s_ease-in]`}></div>
            <div
                className={`absolute inset-0  opacity-0 group-hover:opacity-70 transition-all duration-500 ease-in-out bg-radial-[at_75%_25%] ${gradientStart} ${gradientEnd}`}></div>
        </div>
    )
}