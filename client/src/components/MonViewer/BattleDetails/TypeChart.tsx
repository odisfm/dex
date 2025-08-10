import typeChart from "../../../utils/typeChart.json"
import typesIntroduced from "../../../utils/typesIntroduced.json"
import {type ReactElement, useContext, useMemo, useState} from "react";
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import {compareGenerations} from "../../../utils/util.ts";
import TypeRelation from "./TypeRelation.tsx";
import {TypeLabel} from "../../TypeLabel.tsx";

export default function TypeChart({attackingTypes, defendingTypes}: {
    attackingTypes: any[],
    defendingTypes: any[]
}):ReactElement {
    const versionContext = useContext(VersionContext);

    const typesToUse = useMemo(() => {
        const toUse: string[] = []
        for (const typeName of Object.keys(typesIntroduced)) {
            const introduced: string = typesIntroduced[typeName as keyof typeof typesIntroduced];
            if (compareGenerations(versionContext.versionDetails.generation, introduced) >= 0) {
                toUse.push(typeName)
            }
        }
        return toUse;
    }, [versionContext.versionDetails.generation]);

    const defenseRelations = useMemo((): any[] => {
        if (!defendingTypes.length) return [];
        const dualTyped = defendingTypes.length == 2
        const relations = []
        for (const typeName of typesToUse) {
            const typeARel = typeChart[typeName as keyof typeof typeChart].attack[defendingTypes[0]]
            const typeBRel = !dualTyped ? 1.0 : typeChart[typeName].attack[defendingTypes[1]]
            const relation = typeARel * typeBRel;
            if (relation !== 1.0) {
                relations.push({typeName, relation})
            }
        }

        return relations.sort((a, b)=> {
            if (a.relation == b.relation) {
                return 0
            }
            return a.relation > b.relation ? -1 : 1
        })

    }, [defendingTypes, typesToUse]);

    const attackRelations = useMemo((): any[] => {
        if (!attackingTypes.length) return [];
        const relations = []
        for (const attackTypeName of attackingTypes) {
            const rels = [];
            for (const defendTypeName of typesToUse) {
                const relation = typeChart[attackTypeName].attack[defendTypeName]
                if (relation !== 1.0) {
                    rels.push({typeName: defendTypeName, relation})
                }
            }
            rels.sort((a, b) => {
                if (a.relation === b.relation) {
                    return 0
                }
                return a.relation > b.relation ? -1 : 1
            })
            relations.push({attackType: attackTypeName, relations: rels})
        }
        return relations

    }, [attackingTypes, typesToUse])

    console.log(attackRelations)


    return (
        <div className={"flex flex-col md:flex-row"}>
            <div>
                <h1 className={"font-bold text-xl"}>Defense</h1>
                <div>
                    {defenseRelations.map((typeRel, index) => {
                        return <TypeRelation key={index} typeName={typeRel.typeName} relation={typeRel.relation}
                                             mode={"defend"}/>
                    })}
                </div>
            </div>
            <div>
                <h1 className={"font-bold text-xl"}>Attack</h1>
                <div className={"flex flex-wrap gap-1"}>
                    {attackRelations.map((typeRel, index) => {
                        return (
                            <div>
                            <TypeLabel pokeType={typeRel.attackType} size={"sm"} />
                                <div className={"flex flex-col gap-1"}>
                                    {typeRel.relations.map((rel) => {
                                    return <TypeRelation relation={rel.relation} mode={"attack"} typeName={rel.typeName} />
                                })}
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </div>
        </div>
    )
}
