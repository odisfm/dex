import {PokeAPI} from "pokeapi-types";
import {type ReactElement, useContext, useMemo} from "react";
import Card from "./Card.tsx";
import {getAbilities} from "../../../utils/apiParsing.ts";
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import MonAbility from "./MonAbility.tsx";
import TypeChart from "./TypeChart.tsx";

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
        let hp, attack, defense, specialAttack, specialDefense, speed: number;
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
        }

    }, [mon])

    if (!mon) {
        return null
    }

    return (
        <>
            <h2 className={"font-bold text-4xl"}>Battle</h2>

            <div className={"flex flex-col md:flex-row flex-wrap gap-2 items-stretch w-full justify-center"}>

                <Card>
                    <h3>Stats</h3>
                    <table className={"text-right [&_td]:px-3"}>
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
                <Card>
                    <h3>Abilities</h3>
                    <div className={"flex flex-col gap-2"}>
                        {mon.abilities.map((ab, index) => {
                        return (
                            <MonAbility ability={ab} key={index}>

                            </MonAbility>)

                    })}</div>
                </Card>
                <Card extraStyles={"lg:w-2/3"}>
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