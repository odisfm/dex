import {typePalettesMid} from "../utils/typePalettes.tsx";
import {type ReactElement, useContext, useEffect, useMemo, useState} from "react";
import {LanguageContext} from "../contexts/LanguageContext.tsx";
import dex from "../utils/dex.tsx";
import {getLocalName} from "../utils/apiParsing.ts";

export function TypeLabel({pokeType, size = "md"}: { pokeType: string, size: "sm" | "md" | "lg" }): ReactElement {
    const languageContext = useContext(LanguageContext);
    const [labelText, setLabelText] = useState<string>('');

    const style = useMemo(() => {
        if (size === "sm") {
            return {
                px: "px-2",
                py: "py-1",
                textSize: "text-xs"
            };
        } else if (size === "md") {
            return {
                px: "px-3",
                py: "py-2",
                textSize: "text-md"
            };
        } else { // size === "lg"
            return {
                px: "px-4",
                py: "py-3",
                textSize: "text-lg"
            };
        }
    }, [size]);


    useEffect(() => {
        if (!pokeType) return;

        dex.getTypeByName(pokeType)
            .then((typeObj) => {
                return getLocalName(typeObj.names, languageContext.language, languageContext.fallbackLanguage);
            })
            .then((str) => setLabelText(str))
            .catch((error) => {
                console.error('Failed to fetch Pokemon type:', error);
            });
    }, [pokeType, languageContext.language, languageContext.fallbackLanguage]);

    const bgColor: string = typePalettesMid[pokeType as keyof typeof typePalettesMid];

    return (
        <div
            className={`${bgColor} ${style.px} ${style.py} empty:hidden text-white text-center min-w-15 font-bold rounded-md ${style.textSize}`}>
            {labelText.toUpperCase()}
        </div>
    )
}