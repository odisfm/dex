import {createContext} from "react";
import noop from "../utils/noop.ts";

interface LanguageContextValues {
    language: string,
    setLanguage: (language: string) => void,
    fallbackLanguage: string,
    setFallbackLanguage: (language: string) => void,
}

export const LanguageContext = createContext<LanguageContextValues>({
    language: "en",
    setLanguage: noop,
    fallbackLanguage: "en",
    setFallbackLanguage: noop,
})
