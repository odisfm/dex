import type {PokeAPI} from "pokeapi-types";
import {type ReactElement} from "react";
import {Link} from "react-router-dom";

export default function MonVariants({mon, monVariants}:
                                    {
                                        monSpecies: PokeAPI.PokemonSpecies,
                                        mon: PokeAPI.Pokemon,
                                        monVariants: PokeAPI.Pokemon[]
                                    }): ReactElement | null {

    if (monVariants.length < 2) {
        return null;
    }

    const numerals = ["●", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii"]

    let selectedVariant = -1;
    monVariants.forEach(((variant, i) => {
        if (variant.name === mon.name) {
            selectedVariant = i;
        }
    }))

    return (
        <div className={"flex flex-col gap-3 items-center"}>
            <div className={"flex flex-wrap justify-center gap-2 w-50"}>
                {
                    monVariants.map((variety, index) => {
                        return <Link to={`/mon/${variety.name}`} key={index}
                                     className={`p-5 size-5 rounded-full flex items-center justify-center ${selectedVariant === index ? "bg-black text-white hover:bg-neutral-600 " : "bg-white text-black hover:bg-neutral-200 "}`}>{numerals.splice(0, 1)}</Link>
                    })
                }
            </div>
        </div>
    )

}