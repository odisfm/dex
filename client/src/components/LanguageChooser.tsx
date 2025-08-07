import {LanguageContext} from "../contexts/LanguageContext.tsx";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import languageJSON from "../data/langauges.json"

interface LanguageDetail{
    code: string;
    displayName: string;
}

export default function LanguageChooser() {
    const [languages, setLanguages] = useState<LanguageDetail[]>([]);
    const languageContext = useContext(LanguageContext)
    const selectRef = useRef<HTMLSelectElement | null>(null)

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        languageContext.setLanguage(newLanguage);
        console.log(`set language to ${newLanguage}`);
    }

    const getLanguages = useCallback(() => {
        const languageList: LanguageDetail[] = [];
        for (const languageEntry of languageJSON) {
            const code = languageEntry.name;
            let displayName;
            for (const languageName of languageEntry.names) {
                if (languageName.language.name === code) {
                    displayName = languageName.name;
                    break;
                }
            }
            if (!displayName) {
                displayName = code;
            }
            languageList.push({code, displayName})
        }
        setLanguages(languageList);
    }, [])

    useEffect(() => {
        getLanguages()
        const storedLanguagePref = localStorage.getItem('languagePref');
        if (storedLanguagePref) {
            languageContext.setLanguage(storedLanguagePref);
        }
    }, [getLanguages]);

    if (!languages) return null;

    return <div className={"text-black bg-stone-600"}>
        <select
            ref={selectRef}
            value={languageContext.language}
            onChange={handleLanguageChange}
        >
            {languages.map((language) => (
                <option
                    key={language.code}
                    value={language.code}
                >
                    {language.displayName}
                </option>
            ))}
        </select>
    </div>;
}