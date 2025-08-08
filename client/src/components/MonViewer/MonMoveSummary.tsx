import type {ReactElement} from "react";
import type {CondensedMonMove, MoveLearnDef} from "../../utils/apiParsing.ts";
import {TypeLabel} from "../TypeLabel.tsx";


export type MoveSummaryData = {
    condensed: CondensedMonMove,
    learnDef: MoveLearnDef
}

export default function MonMoveSummary({move} :{move: MoveSummaryData}): ReactElement | null {
    if (!move) {
        return null;
    }

    return (
        <div className={"flex gap-2 bg-white hover:bg-neutral-50 text-black px-2 py-2"}>
            <div className={"flex flex-col gap-1"}>
                <h1 className={"font-bold"}>{move.condensed.name}</h1>
                <span>{move.condensed.flavorText}</span>
                <span>
                    {move.learnDef.level_learned_at ?
                        `Learned at level ${move.learnDef.level_learned_at}`
                        : `Learned with ${move.learnDef.move_learn_method.name}`
                    }
                </span>
            </div>
            <div className={"flex flex-col ml-auto p-2"}>
                <TypeLabel pokeType={move.condensed.fullMove.type.name} size={"sm"}/>
            </div>
        </div>
    )

}