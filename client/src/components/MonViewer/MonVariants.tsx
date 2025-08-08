import {PokeAPI} from "pokeapi-types";
import {type ReactElement, useMemo} from "react";
import {Link} from "react-router-dom";

export default function MonVariants({monSpecies, mon}: {monSpecies: PokeAPI.PokemonSpecies, mon: PokeAPI.Pokemon}): ReactElement | null {
    if (monSpecies.varieties.length === 1) {
        return null
    }

    const numerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii"]

    const filteredVars = useMemo(() => {
        return monSpecies.varieties.filter((variety) => {
            return !variety.pokemon.name.includes("totem")
        })
    }, [monSpecies.varieties])

    let selectedForm = 0;
    for (let i = 0; i < filteredVars.length; i++) {
        const thisVar = monSpecies.varieties[i];
        if (thisVar.pokemon.name === mon.name) {
            selectedForm = i;
            break;
        }
    }

    if (filteredVars.length < 2) {
        return null;
    }

    return (
        <div className={"flex flex-col gap-3 items-center"}>
            <div className={"flex flex-wrap justify-center gap-2 w-50"}>
                {
                    filteredVars.map((variety, index) => {
                        return <Link to={`/mon/${variety.pokemon.name}`}
                                     className={`p-5 size-5 rounded-full flex items-center justify-center ${selectedForm === index ? "bg-black text-white" : "bg-blue-500"}`}>{numerals.splice(0, 1)}</Link>
                    })
                }
            </div>
        </div>
    )

}