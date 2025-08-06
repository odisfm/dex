import {LanguageContext} from "../contexts/LanguageContext.tsx";
import {useContext, useRef} from "react";

const languages = ["en", "it", "de", "fr"]

export default function LanguageChooser() {
    const languageContext = useContext(LanguageContext)
    const selectRef = useRef<HTMLSelectElement | null>(null)

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        languageContext.setLanguage(newLanguage);
        console.log(`set language to ${newLanguage}`);
    }

    return <div className={"text-black bg-stone-600"}>
        <select
            ref={selectRef}
            value={languageContext.language}
            onChange={handleLanguageChange}
        >
            {languages.map((language) => (
                <option
                    key={language}
                    value={language}
                >
                    {language.toUpperCase()}
                </option>
            ))}
        </select>
    </div>;
}