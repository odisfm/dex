import * as React from "react";
import {useState} from "react";
import {LanguageContext} from "./LanguageContext.tsx";

export default function LanguageProvider({children}: React.PropsWithChildren): React.ReactElement {
    const [language, setLanguage] = useState<string>("en")
    const [fallbackLanguage, setFallbackLanguage] = useState<string>("it")

    const doSetLanguage = (language: string) => {
        setLanguage(language);
        localStorage.setItem("languagePref", language);
    }

    return (
        <LanguageContext.Provider value={{language, setLanguage: doSetLanguage, fallbackLanguage, setFallbackLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}