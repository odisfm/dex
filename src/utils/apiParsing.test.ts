import {beforeAll, expect, test} from "vitest";
import * as apiParsing from './apiParsing';
import type {PokeAPI} from "pokeapi-types";
import {Pokedex} from "pokeapi-js-wrapper";

const setupPokemon = () => {
    const pokemon = new Map();
    const pokemonSpecies = new Map();
    const dex = new Pokedex({cache: false});

    beforeAll(async () => {
        const pokemonNames = ["clefairy", "pikachu", "charizard"];
        const pokemonData = await Promise.all(
            pokemonNames.map(name => dex.getPokemonByName(name))
        );

        pokemonNames.forEach((name, index) => {
            pokemon.set(name, pokemonData[index]);
        });
        const pokemonSpeciesData = await Promise.all(
            pokemonNames.map(name => dex.getPokemonSpeciesByName(name))
        );

        pokemonNames.forEach((name, index) => {
            pokemonSpecies.set(name, pokemonSpeciesData[index]);
        });
    });

    return [pokemon, pokemonSpecies];
};

const [pokemon, pokemonSpecies] = setupPokemon();

test("shows clefairy as normal type pre gen-vi", () => {
    const clefairy = pokemon.get("clefairy");
    const relevantTypes = apiParsing.getTypes(clefairy.types, clefairy.past_types, "generation-iii")
    const type1 = relevantTypes[0].type.name
    expect(type1).toBe("normal")
})

test("shows clefairy as fairy type at gen-vi", () => {
    const clefairy = pokemon.get("clefairy");
    const relevantTypes = apiParsing.getTypes(clefairy.types, clefairy.past_types, "generation-vi")
    const type1 = relevantTypes[0].type.name
    expect(type1).toBe("fairy")
})

test("returns charizard's name in french as `Dracaufeu`", () => {
    const charizard = pokemonSpecies.get("charizard") as PokeAPI.PokemonSpecies;
    expect(
        apiParsing.getLocalName(charizard.names, "fr")
    ).toBe("Dracaufeu")
})
