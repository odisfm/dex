import {type ReactElement, useContext, useEffect, useMemo, useState} from "react";
import {PokeAPI} from "pokeapi-types";
import {getLocalName} from "../../../utils/apiParsing.ts";
import {LanguageContext} from "../../../contexts/LanguageContext.tsx";
import dex from "../../../utils/dex.tsx"

export default function MonAbility({ability}: { ability: PokeAPI.PokemonAbility }): ReactElement {
    const languageContext = useContext(LanguageContext);
    const [abilityObj, setAbilityObj] = useState<PokeAPI.Ability | null>(null);

    useEffect(() => {
        (async () => {
            const obj = await dex.getAbilityByName(ability.ability.name)
            setAbilityObj(obj);
        })()
    }, [ability]);

    const abilityName = useMemo(() => {
        if (!abilityObj) {
            return ;
        }
        // console.log(ability)
        return getLocalName(abilityObj.names, languageContext.language, languageContext.fallbackLanguage)
    }, [abilityObj, languageContext]);

    const abilityEffect = useMemo(() => {
        if (!abilityObj) {
            return
        }
        return
    })

    return (
        <div>
            {abilityName}
        </div>
    )
}