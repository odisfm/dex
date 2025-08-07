import {typePalettesMid} from "../utils/typePalettes.tsx";
import {type ReactElement, useContext, useEffect, useState} from "react";
import {LanguageContext} from "../contexts/LanguageContext.tsx";
import dex from "../utils/dex.tsx";
import {getLocalName} from "../utils/apiParsing.ts";

export function TypeLabel({pokeType}: { pokeType: string }): ReactElement {
    const languageContext = useContext(LanguageContext);
    const [labelText, setLabelText] = useState<string>('');

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
        <div className={`${bgColor} px-4 py-2`}>
            {labelText}
        </div>
    )
}