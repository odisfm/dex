import type {EncounterSummaryData} from "./MonEncounters.tsx";
import type {PokeAPI} from "pokeapi-types";


export default function MonEncounterSummary({encounterData}: { encounterData: EncounterSummaryData }) {
    return (
        <div className={"bg-white p-2"}>
            {encounterData.name}
            {encounterData.encounters.map((enc: PokeAPI.Encounter, index: number) => (
                <div key={index} className="">
                    {`Level ${enc.min_level}-${enc.max_level} | ${enc.chance} | ${enc.method.name}`}
                </div>
            ))}
        </div>
    );
}