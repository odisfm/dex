import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {getSprites} from "../../utils/apiParsing.ts";

export default function MonSprite({mon}: {mon:PokeAPI.Pokemon}): ReactElement {
    const [activeSprite, setActiveSprite] = useState<"string" | null>(null);
    const versionContext = useContext(VersionContext)
    const imageRef = useRef<HTMLImageElement | null>(null);
    //
    // const getSprite = useCallback(async () => {
    //     if (!mon) {
    //         return;
    //     }
    //
    // }, [mon])

    useEffect(() => {
        if (!mon || !imageRef.current) {
            return;
        }
        const sprites = getSprites(mon.sprites, versionContext.generation, versionContext.versionGroup, versionContext.version)
        imageRef.current.src = sprites.front_default
    }, [mon, versionContext]);

    return (
        <div className={"size-60"}>
            <img ref={imageRef} className={"size-60 object-contain pixel-image"}/>
        </div>
    )
}