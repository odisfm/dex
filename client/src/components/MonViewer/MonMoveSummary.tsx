import {type ReactElement, useContext, useMemo} from "react";
import type {CondensedMonMove, MoveLearnDef} from "../../utils/apiParsing.ts";
import {TypeLabel} from "../TypeLabel.tsx";
import PowerIcon from "../../icon/boxing-glove.svg?react"
import AccuracyIcon from "../../icon/bullseye.svg?react"
import PriorityIcon from "../../icon/run-fast.svg?react"
import {DamageClassLabel} from "../DamageClassLabel.tsx";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {compareGenerations} from "../../utils/util.ts";

const specialSplitTypes = [
    "fire", "ware", "grass", "electric", "psychic", "ice", "dragon", "dark"
]

export type MoveSummaryData = {
    condensed: CondensedMonMove,
    learnDef: MoveLearnDef
}

export default function MonMoveSummary({move} :{move: MoveSummaryData}): ReactElement | null {
    const versionContex = useContext(VersionContext)
    const damageClass = useMemo(() => {
        if (compareGenerations(versionContex.versionDetails.generation, "generation-iv") === 1) {
            if (move.condensed.fullMove.damage_class.name === "status") {
                return "status"
            }
            if (move.condensed.fullMove.type.name in specialSplitTypes) {
                return "special"
            } else {
                return "physical"
            }
        } else {
            return move.condensed.fullMove.damage_class.name
        }
    }, [versionContex.versionDetails.generation, move])

    if (!move) {
        return null;
    }

    return (
        <div className={"flex flex-col md:flex-row gap-3 md:gap-2 bg-white hover:bg-neutral-50 text-black py-3 px-2"}>
            <div className={"flex flex-col md:w-2/6  md:grow-1 gap-1 p-1"}>
                <h1 className={"font-bold"}>{move.condensed.name}</h1>
                <span className={"p-1"}>{move.condensed.flavorText}</span>

                {move.learnDef.level_learned_at ?
                    <span className={"font-bold text-neutral-500"}>Learned at Level {move.learnDef.level_learned_at}</span>
                    : null
                }
            </div>
            <div className={"flex grow-1 md:w-3/6 md:ml-auto md:justify-end gap-4 [&_svg]:size-10"}>
                <table className={"grow-1 w-1/2 bg-gray-100 p-1"}>
                    <thead className={"**:border-l-neutral-200 **:lg:not-first:border-l-2 **:px-2 text-left"}>
                    <tr>
                        <th className={""}>
                            <PowerIcon />
                        </th>
                        <th>
                            <AccuracyIcon />
                        </th>
                        <th>
                            PP
                        </th>
                        <th>
                            <PriorityIcon />
                        </th>
                    </tr>
                    </thead>
                    <tbody className={"**:px-2 text-left"}>
                    <tr>
                        <td>
                            {move.condensed.values.power || "-"}
                        </td>
                        <td>
                            {move.condensed.values.accuracy || "-"}
                        </td>
                        <td>
                            {move.condensed.values.pp}
                        </td>
                        <td>
                            {move.condensed.values.priority || "-"}
                        </td>
                    </tr>
                    </tbody>
                </table>

                <div className={"flex flex-col gap-1 w-1/3 md:w-2/6 items-end justify-center"}>
                    <TypeLabel pokeType={move.condensed.fullMove.type.name} size={"md"}/>
                    <DamageClassLabel damageClass={damageClass}/>
                </div>
            </div>
        </div>
    )

}