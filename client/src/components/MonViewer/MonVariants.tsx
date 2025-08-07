import {PokeAPI} from "pokeapi-types";
import {type ReactElement, useMemo} from "react";
import {Link} from "react-router-dom";

export default function MonVariants({monSpecies, mon}: {monSpecies: PokeAPI.PokemonSpecies, mon: PokeAPI.Pokemon}): ReactElement | null {
    if (monSpecies.varieties.length === 1) {
        return null
    }

    const numerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]

    let selectedForm = 0;
    for (let i = 0; i < monSpecies.varieties.length; i++) {
        const thisVar = monSpecies.varieties[i];
        if (thisVar.pokemon.name === mon.name) {
            selectedForm = i;
            break;
        }
    }

    const variantName = useMemo(() => {
        const varieties = monSpecies.varieties;
        for (let i = 0; i < varieties.length; i++) {
            let thisVar = varieties[i];
            if (thisVar.pokemon.name === mon.name) {
                if (thisVar.is_default) {
                    return ""
                } else {
                    let splitName = thisVar.pokemon.name.split("-").slice(1)
                    splitName = splitName.map((word) => {
                        return word.charAt(0).toUpperCase() + word.slice(1)
                    })
                    let varName = splitName.join(" ")
                    if (varName === "Gmax") {
                        varName = "Gigantamax"
                    }
                    return varName
                }
            }
        }
    }, [monSpecies, mon])

    return (
        <div className={"flex flex-col gap-3 items-center"}>
            { variantName ?
                <span className={"bg-white rounded-lg py-1 px-3 text-center text-black font-bold"}>{variantName}</span>
                : null
            }
            <div className={"flex gap-2"}>
                {
                    monSpecies.varieties.map((variety, index) => {
                        return <Link to={`/mon/${variety.pokemon.name}`}
                                     className={`p-5 size-5 rounded-full flex items-center justify-center ${selectedForm === index ? "bg-black" : "bg-blue-500"}`}>{numerals.splice(0, 1)}</Link>
                    })
                }
            </div>
        </div>
    )

}