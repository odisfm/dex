import {createContext} from "react";
import type {PokeAPI} from "pokeapi-types";

interface VersionDetails {
    generation: string,
    versionGroup:  string,
    version: string,
    groupVersions: string[],
}

interface VersionContext {
    versionDetails: VersionDetails,
    setGeneration: (generation: string) => void,
    setVersionGroup: (group: string) => void,
    setVersion: (version: string) => void,
    restrictGeneration: null | string,
    setRestrictGeneration: (restrictVersion: string) => void,
    pokedexes: PokeAPI.Pokedex[],
}

export const VersionContext = createContext<VersionContext>({
    versionDetails: {
        generation: "generation-iii",
        versionGroup: "emerald",
        version: "emerald",
        groupVersions: ["emerald"],
    },
    setGeneration: () => {},
    setVersionGroup: () => {},
    setVersion: () => {},
    restrictGeneration: null,
    setRestrictGeneration: () => {},
    pokedexes: [],
});

