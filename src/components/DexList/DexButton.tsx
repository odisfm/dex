import {type Dispatch, type ReactElement, type SetStateAction, useContext, useEffect, useState} from "react";
import {getLocalName} from "../../utils/apiParsing.ts";
import {LanguageContext} from "../../contexts/LanguageContext.tsx";
import type {PokeAPI} from "pokeapi-types";

export default function DexButton({pdex, setDex, selected}: {
    pdex: PokeAPI.Pokedex,
    setDex: Dispatch<SetStateAction<PokeAPI.Pokedex | null>>,
    selected: boolean
}): ReactElement {
    const [localName, setLocalName] = useState<string>('');
    const languageContext = useContext(LanguageContext);

    useEffect(() => {
        (async () => {
            let name = getLocalName(pdex.names, languageContext.language, languageContext.fallbackLanguage)
            if (name.startsWith("Updated ")) {
                name = name.split("Updated ")[1];
            }
            setLocalName(name)
        })()
    }, [pdex, languageContext])

    return (
        <button
            className={`${selected ? "bg-black text-white hover:bg-gray-700 " : "bg-white hover:bg-gray-100"} cursor-pointer py-2 px-4 rounded-lg`}
            onClick={() => {
                setDex(pdex)
            }}>
            {localName} Dex
        </button>
    )
}