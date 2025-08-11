import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useContext, useMemo} from "react";
import Card from "./Card.tsx";
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import MonAbility from "./MonAbility.tsx";
import TypeChart from "./TypeChart.tsx";
import {compareGenerations} from "../../../utils/util.ts";

type MonStats = {
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number,
}

export default function MonBattleDetails({mon}: { mon: PokeAPI.Pokemon }): ReactElement | null {
    const versionContext = useContext(VersionContext);


    const monStats: MonStats = useMemo(() => {
        let hp, attack, defense, specialAttack, specialDefense, speed: number = 0;
        for (const stat of mon.stats) {
            const val = stat.base_stat
            switch (stat.stat.name) {
                case "hp":
                    hp = val
                    break;
                case "attack":
                    attack = val;
                    break;
                case "defense":
                    defense = val;
                    break;
                case "special-attack":
                    specialAttack = val;
                    break;
                case "special-defense":
                    specialDefense = val;
                    break;
                case "speed":
                    speed = val;
            }
        }

        return {
            hp, attack, defense, specialAttack, specialDefense, speed
        } as MonStats;

    }, [mon])


    const preLatestGen = useMemo(() => {
        return compareGenerations(versionContext.versionDetails.generation, "generation-ix") < 0
    }, [versionContext.versionDetails.generation])

    const hasAbilities = useMemo(() => {
        return compareGenerations(versionContext.versionDetails.generation, "generation-iii") >= 0
    }, [versionContext.versionDetails.generation])

    if (!mon) {
        return null
    }

    return (
        <>
            <h2 id="battle" className={"font-bold text-4xl"}>Battle</h2>
            {preLatestGen ?
                <span className={"italic opacity-75"}>Stats based on Gen 9 data.</span>
                : null
            }

            <div className={"flex flex-col md:flex-row flex-wrap gap-2  w-full justify-center "}>

                <Card extraStyles={null} id={"stats"}>
                    <h3>Base stats</h3>
                    <table className={"text-right [&_td]:font-bold [&_td]:px-3 [&_td]:bg-gray-100 [&_td]:rounded-lg border-separate border-spacing-2"}>
                        <tbody>
                        <tr>
                            <th>HP</th>
                            <td>{monStats.hp}</td>
                        </tr>
                        <tr>
                            <th>Attack</th>
                            <td>{monStats.attack}</td>
                        </tr>
                        <tr>
                            <th>Defense</th>
                            <td>{monStats.defense}</td>
                        </tr>
                        <tr>
                            <th>Special Attack</th>
                            <td>{monStats.specialAttack}</td>
                        </tr>
                        <tr>
                            <th>Special Defense</th>
                            <td>{monStats.specialDefense}</td>
                        </tr>
                        <tr>
                            <th>Speed</th>
                            <td>{monStats.speed}</td>
                        </tr>
                        </tbody>
                    </table>
                </Card>
                { hasAbilities ?
                    <Card extraStyles={null} id={"abilities"}>
                    <h3>Abilities</h3>
                    <div className={"flex flex-col gap-2"}>
                        {mon.abilities.map((ab, index) => {
                        return (
                            <MonAbility ability={ab} key={index}>

                            </MonAbility>)

                    })}</div>
                </Card>
                : null
                }
                <Card extraStyles={"lg:w-2/3"} id={"typing"}>
                    <h3>Typing</h3>
                    <TypeChart
                        attackingTypes=
                            {mon.types.length === 1 ? [mon.types[0].type.name] : [mon.types[0].type.name, mon.types[1].type.name]}
                        defendingTypes=
                            {mon.types.length === 1 ? [mon.types[0].type.name] : [mon.types[0].type.name, mon.types[1].type.name]} />
                </Card>

            </div>
        </>
    )
}