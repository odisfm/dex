import {PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import {LanguageContext} from "../../../contexts/LanguageContext.tsx";
import {getEncounters, getLocalName} from "../../../utils/apiParsing.ts";
import dex from "../../../utils/dex.tsx"
import MonEncounterSummary from "./MonEncounterSummary.tsx";

export type EncounterSummaryData = {
    encounters: PokeAPI.Encounter[],
    name: string,
}

export default function MonEncounters({mon}: { mon: PokeAPI.Pokemon }): ReactElement {
    const versionContext = useContext(VersionContext)
    const languageContext = useContext(LanguageContext)
    const [encounters, setEncounters] = useState<EncounterSummaryData[]>([])

    const fetchEncounters = useCallback(async () => {
        if (!mon) {
            return;
        }
        const locationEncounterData: PokeAPI.LocationAreaEncounter[] = await dex.getPokemonEncounterAreasByName(mon.name)
        // console.log(locationEncounterData)
        const parse = getEncounters(locationEncounterData, versionContext.versionDetails.version)
        console.log(parse)
        const _encounters: EncounterSummaryData[] = [];
        for (const locationEncounter of parse) {
            console.log(locationEncounter)
            const locationObj: PokeAPI.LocationArea = await dex.getLocationAreaByName(locationEncounter.location_area.name)
            // const methodObj: PokeAPI.EncounterMethod = await dex.resource(locationObj.)
            const locationName = getLocalName(locationObj.names, languageContext.language, languageContext.fallbackLanguage)
            console.log(locationName)
            _encounters.push({
                name: locationName,
                encounters: locationEncounter.encounter_details
            })
        }
        setEncounters(_encounters)

    }, [mon, versionContext.versionDetails.version, languageContext])

    useEffect(() => {
        fetchEncounters().then()
    }, [versionContext.versionDetails.version, mon, fetchEncounters]);

    return (
        <>
            <h1 className={"font-bold text-3xl"}>Encounters</h1>
            <div className={"flex flex-wrap justify-center gap-1"}>
                {encounters.map((enc) => {
                    return <MonEncounterSummary encounterData={enc}/>

                })}
            </div>
        </>
    )
}