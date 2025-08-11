import {type ReactElement, useContext, useEffect, useMemo, useState} from "react";
import type {PokeAPI} from "pokeapi-types";
import {getAbilityFlavorText, getLocalName} from "../../../utils/apiParsing.ts";
import {LanguageContext} from "../../../contexts/LanguageContext.tsx";
import dex from "../../../utils/dex.tsx"
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import {compareGenerations} from "../../../utils/util.ts";
// @ts-expect-error "path"
import HiddenIcon from "../../../icon/eye-off.svg?react"

export default function MonAbility({ability}: { ability: PokeAPI.PokemonAbility }): ReactElement | null {
    const languageContext = useContext(LanguageContext);
    const versionContext = useContext(VersionContext);
    const [abilityObj, setAbilityObj] = useState<PokeAPI.Ability | null>(null);

    useEffect(() => {
        (async () => {
            const obj = await dex.getAbilityByName(ability.ability.name)
            setAbilityObj(obj);
        })()
    }, [ability]);

    const abilityName = useMemo(() => {
        if (!abilityObj) {
            return;
        }
        return getLocalName(abilityObj.names, languageContext.language, languageContext.fallbackLanguage)
    }, [abilityObj, languageContext]);

    const abilityEffect = useMemo(() => {
        if (!abilityObj) {
            return
        }
        return getAbilityFlavorText(
            abilityObj.flavor_text_entries,
            versionContext.versionDetails.versionGroup,
            languageContext.language,
        )
    }, [abilityObj, versionContext.versionDetails.versionGroup, languageContext.language])

    if (abilityObj && compareGenerations(versionContext.versionDetails.generation, abilityObj.generation.name) < 0) {
        return null
    }

    return (
        <div className={"flex flex-col"}>
            <div className={`flex gap-2 items-center ${ability.is_hidden ? "opacity-55 " : " "}`}>
                <h4 className={"font-bold"}>{abilityName}</h4>
                {
                    ability.is_hidden ?
                        <div className={"size-6 fill-gray-600"}>
                            <HiddenIcon/>
                        </div>
                        : null
                }
            </div>
            <p>{abilityEffect}</p>
        </div>
    )
}