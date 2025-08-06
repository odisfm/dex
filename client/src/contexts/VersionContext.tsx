import {supportedGenerations, supportedVersionGroups, supportedVersions} from "../../versionData.tsx";
import {createContext} from "react";
import * as React from "react";

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

export default function VersionProvider({ children }: React.PropsWithChildren): React.ReactElement {
    const [generation, setGeneration] = React.useState(supportedGenerations[0]);
    const [versionGroup, setVersionGroup] = React.useState(supportedVersionGroups[0].name);
    const [version, setVersion] = React.useState(supportedVersions[0]);


    return <VersionContext.Provider value={{generation, setGeneration, versionGroup, setVersionGroup, version, setVersion}}>
        {children}
    </VersionContext.Provider>
}
