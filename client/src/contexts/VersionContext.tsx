import {createContext} from "react";

interface VersionContext {
    generation: string,
    versionGroup:  string,
    version: string
    setGeneration: (generation: string) => void,
    setVersionGroup: (group: string) => void,
    setVersion: (version: string) => void,
}

export const VersionContext = createContext<VersionContext>({
    generation: "generation-iii",
    versionGroup: "emerald",
    version: "emerald",
    setGeneration: () => {},
    setVersionGroup: () => {},
    setVersion: () => {},
});
