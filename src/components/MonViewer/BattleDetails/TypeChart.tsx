import typeChart from "../../../utils/typeChart.json"
import typesIntroduced from "../../../utils/typesIntroduced.json"
import {type ReactElement, useContext, useMemo} from "react";
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import {compareGenerations} from "../../../utils/util.ts";
import TypeRelation from "./TypeRelation.tsx";
import {TypeLabel} from "../../TypeLabel.tsx";

export default function TypeChart({attackingTypes, defendingTypes}: {
    attackingTypes: unknown[],
    defendingTypes: unknown[]
}): ReactElement {
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

    const defenseRelations = useMemo((): unknown[] => {
        if (!defendingTypes.length) return [];
        const dualTyped = defendingTypes.length == 2
        const relations = []
        for (const typeName of typesToUse) {
            const typeARel = typeChart[typeName as keyof typeof typeChart].attack[defendingTypes[0] as keyof typeof typeChart]
            const typeBRel = !dualTyped ? 1.0 : typeChart[typeName as keyof typeof typeChart].attack[defendingTypes[1] as keyof typeof typeChart]
            const relation = typeARel * typeBRel;
            if (relation !== 1.0) {
                relations.push({typeName, relation})
            }
        }

        return relations.sort((a, b) => {
            if (a.relation == b.relation) {
                return 0
            }
            return a.relation > b.relation ? -1 : 1
        })

    }, [defendingTypes, typesToUse]);

    const attackRelations = useMemo((): unknown[] => {
        if (!attackingTypes.length) return [];
        const relations = []
        for (const attackTypeName of attackingTypes) {
            const rels = [];
            for (const defendTypeName of typesToUse) {
                const relation = typeChart[attackTypeName as keyof typeof typeChart].attack[defendTypeName as keyof typeof typeChart]
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


    return (
        <div className={"flex  lg:flex-wrap gap-10 flex-wrap w-full justify-center"}>
            <div className={"flex flex-col items-center gap-4 grow-1"}>
                <h1 className={"font-bold text-2xl"}>Defense</h1>
                <div className={"flex gap-2"}>{defendingTypes.map((type, index) => {
                    return <TypeLabel key={index} pokeType={type} size={"sm"}/>
                })}</div>
                <div
                    className={"grow-0 grid  gap-1 grid-cols-3 lg:grid-cols-6 grid-flow-row bg-gray-100 p-2 rounded-md"}>
                    {defenseRelations.map((typeRel, index) => {
                        return <TypeRelation key={index} typeName={typeRel.typeName} relation={typeRel.relation}
                                             mode={"defend"}/>
                    })}
                </div>
            </div>

            <div className={"flex flex-col gap-4 items-center"}>
                <h1 className={"font-bold text-2xl"}>Attack</h1>

                <div className={"flex flex-wrap gap-5 justify-center"}>
                    {attackRelations.map((typeRel, index) => {
                        return (
                            // <div className={"flex flex-col flex-wrap gap-2"}>
                            <div key={index} className={"flex flex-col gap-2 items-center "}>
                                <div className={"self-center"}><TypeLabel pokeType={typeRel.attackType} size={"sm"}/>
                                </div>
                                <div className={"grid grid-cols-3 lg:grid-cols-6 gap-1 bg-gray-100 p-2 rounded-md"}>
                                    {typeRel.relations.map((rel: {
                                        relation: number,
                                        typeName: string
                                    }, index: number) => {
                                        return <TypeRelation key={index} relation={rel.relation} mode={"attack"}
                                                             typeName={rel.typeName}/>
                                    })}
                                </div>
                            </div>
                        )
                    })}</div>
            </div>
        </div>
    )
}
