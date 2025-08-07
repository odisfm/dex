import { VersionContext } from "./VersionContext";
import {supportedGenerations, supportedVersionGroups, supportedVersions} from "../../versionData.tsx";
import * as React from "react";
import {useCallback, useEffect} from "react";

export default function VersionProvider({ children }: React.PropsWithChildren): React.ReactElement {
    const [generation, setGeneration] = React.useState(supportedGenerations[0]);
    const [versionGroup, setVersionGroup] = React.useState(supportedVersionGroups[0].api_path);
    const [version, setVersion] = React.useState(supportedVersions[0]);
    const [groupVersions, setGroupVersions] = React.useState(supportedVersionGroups[0].versions);
    const [restrictGeneration, setRestrictGeneration] = React.useState<string | null>(null);

    const setGame = (newVersionGroup?: string | null, newVersion?: string | null, newGeneration?: string | null) => {
        if (!newVersionGroup && !newVersion && !newGeneration) {
            throw new Error("Must provide either newVersionGroup or newVersion");
        }

        let finalVersionGroup!: string;
        let finalVersion!: string;
        let finalGeneration!: string;
        let newGroupVersions: string[] = [];

        if (newVersion) {
            let found = false;
            for (const versionGroup of supportedVersionGroups) {
                for (const version of versionGroup.versions) {
                    if (version === newVersion) {
                        finalVersionGroup = versionGroup.api_path;
                        finalGeneration = versionGroup.generation;
                        newGroupVersions = versionGroup.versions;
                        finalVersion = newVersion;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) {
                throw new Error(`Invalid version: ${newVersion}`);
            }
        } else if (newVersionGroup) {
            const versionGroup = supportedVersionGroups.find(vg => vg.api_path === newVersionGroup);
            if (!versionGroup) {
                throw new Error(`Invalid version group: ${newVersionGroup}`);
            }

            finalVersionGroup = newVersionGroup;
            finalVersion = versionGroup.versions[0];
            finalGeneration = versionGroup.generation;
            newGroupVersions = versionGroup.versions;
        } else if (newGeneration) {
            const versionGroup = supportedVersionGroups.find(vg => vg.generation === newGeneration);
            if (!versionGroup) {
                throw new Error(`Invalid generation: ${newGeneration}`);
            }

            finalVersionGroup = versionGroup.api_path;
            finalVersion = versionGroup.versions[0];
            finalGeneration = newGeneration;
            newGroupVersions = versionGroup.versions;
        }

        if (!finalGeneration || !finalVersionGroup || !finalVersion || !newGroupVersions.length) {
            throw new Error(`Failed to parse some details: generation=${finalGeneration}, versionGroup=${finalVersionGroup}, version=${finalVersion}, groupVersions=${newGroupVersions}`);
        }

        setGeneration(finalGeneration);
        setVersionGroup(finalVersionGroup);
        setVersion(finalVersion);
        setGroupVersions(newGroupVersions);
        localStorage.setItem('versionGroup', finalVersionGroup);
    };

    const safeSetVersionGroup = useCallback((newVersionGroup: string): void => {
        setGame(newVersionGroup)
    }, [])

    const safeSetVersion = (newVersion: string): void => {
        setGame(null, newVersion)
    }

    const safeSetGeneration = (newGeneration: string): void => {
        setGame(null, null, newGeneration)
    }

    useEffect(() => {
        const storedVersionGroupPref = localStorage.getItem("versionGroup");
        if (storedVersionGroupPref) {
            safeSetVersionGroup(storedVersionGroupPref);
        }
    }, [safeSetVersionGroup]);


    return <VersionContext.Provider value={{
        generation,
        setGeneration: safeSetGeneration,
        versionGroup,
        setVersionGroup: safeSetVersionGroup,
        version,
        setVersion: safeSetVersion,
        groupVersions,
        restrictGeneration,
        setRestrictGeneration
    }}
    >
        {children}
    </VersionContext.Provider>
}
