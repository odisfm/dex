import { VersionContext } from "./VersionContext";
import {supportedGenerations, supportedVersionGroups, supportedVersions} from "../../versionData.tsx";
import * as React from "react";

export default function VersionProvider({ children }: React.PropsWithChildren): React.ReactElement {
    const [generation, setGeneration] = React.useState(supportedGenerations[0]);
    const [versionGroup, setVersionGroup] = React.useState(supportedVersionGroups[0].api_path);
    const [version, setVersion] = React.useState(supportedVersions[0]);

    const safeSetVersionGroup = (newVersionGroup: string): void => {
        let generation;
        let version;
        for (let i = 0; i < supportedVersionGroups.length; i++) {
            const thisVersionGroup = supportedVersionGroups[i];
            if (thisVersionGroup.api_path === newVersionGroup) {
                generation = thisVersionGroup.generation;
                version = thisVersionGroup.versions[0]
                break;
            }
        }
        if (!generation || !version) {
            throw new Error(`Unrecognized version group ${newVersionGroup}`);
        }
        setGeneration(generation);
        setVersionGroup(newVersionGroup);
        setVersion(version)
    }


    return <VersionContext.Provider value={{generation, setGeneration, versionGroup, setVersionGroup: safeSetVersionGroup, version, setVersion}}>
        {children}
    </VersionContext.Provider>
}
