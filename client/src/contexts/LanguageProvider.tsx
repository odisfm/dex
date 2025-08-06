import * as React from "react";
import {useState} from "react";
import {LanguageContext} from "./LanguageContext.tsx";

export default function LanguageProvider({children}: React.PropsWithChildren): React.ReactElement {
    const [language, setLanguage] = useState<string>("en")
    const [fallbackLanguage, setFallbackLanguage] = useState<string>("it")

    return (
        <LanguageContext.Provider value={{language, setLanguage, fallbackLanguage, setFallbackLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}