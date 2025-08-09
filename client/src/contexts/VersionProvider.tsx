import { VersionContext } from "./VersionContext";
import {supportedVersionGroups} from "../../versionData.tsx";
import * as React from "react";
import {useCallback, useEffect, useMemo} from "react";
import type {PokeAPI} from "pokeapi-types";
import dex from "../utils/dex.tsx";

export default function VersionProvider({ children }: React.PropsWithChildren): React.ReactElement | null {
    const [generation, setGeneration] = React.useState<string>();
    const [versionGroup, setVersionGroup] = React.useState<string>();
    const [version, setVersion] = React.useState<string>();
    const [groupVersions, setGroupVersions] = React.useState<string[]>([]);
    const [restrictGeneration, setRestrictGeneration] = React.useState<string | null>(null);
    const [pokedexes, setPokedexes] = React.useState<PokeAPI.Pokedex[]>([]);
    const [nationalDex, setNationalDex] = React.useState<PokeAPI.Pokedex | null>(null);
    const [initialised, setInitialised] = React.useState(false);

    const setGame = useCallback((newVersionGroup?: string | null, newVersion?: string | null, newGeneration?: string | null) => {
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
            throw new Error(`Failed to parse some details`);
        }

        setGeneration(finalGeneration);
        setVersionGroup(finalVersionGroup);
        setVersion(finalVersion);
        setGroupVersions(newGroupVersions);
        localStorage.setItem("versionGroup", finalVersionGroup);
    }, []);

    const safeSetVersionGroup = useCallback((newVersionGroup: string) => {
        setGame(newVersionGroup);
    }, [setGame]);

    const safeSetVersion = useCallback((newVersion: string) => {
        setGame(null, newVersion);
    }, [setGame]);

    const safeSetGeneration = useCallback((newGeneration: string) => {
        setGame(null, null, newGeneration);
    }, [setGame]);

    const versionDetails = useMemo(() => {
        return {
            generation: generation ?? "",
            versionGroup: versionGroup ?? "",
            version: version ?? "",
            groupVersions
        };
    }, [generation, versionGroup, version, groupVersions]);

    const getPokedexes = useCallback(async (): Promise<void> => {
        if (!versionDetails.versionGroup) return;

        console.log('getting pokedexes', versionDetails);
        const versionGroup = await dex.getVersionGroupByName(versionDetails.versionGroup);
        const dexEntries = versionGroup.pokedexes;
        const dexObjList: PokeAPI.Pokedex[] = [];

        for (const dexEntry of dexEntries) {
            const dexObj = await dex.getPokedexByName(dexEntry.name);
            dexObjList.push(dexObj);
        }

        const natDex = await dex.getPokedexByName("national")
        setNationalDex(natDex)

        setPokedexes(dexObjList);
        console.log("Pokedexes:", dexObjList);
    }, [versionDetails]);

    const contextValue = useMemo(() => ({
        versionDetails,
        setGeneration: safeSetGeneration,
        setVersionGroup: safeSetVersionGroup,
        setVersion: safeSetVersion,
        restrictGeneration,
        setRestrictGeneration,
        pokedexes,
        nationalDex,
    }), [
        versionDetails,
        safeSetGeneration,
        safeSetVersionGroup,
        safeSetVersion,
        restrictGeneration,
        setRestrictGeneration,
        pokedexes,
        nationalDex,
    ]);

    useEffect(() => {
        const storedVersionGroup = localStorage.getItem("versionGroup");

        if (storedVersionGroup) {
            setGame(storedVersionGroup);
        } else {
            const defaultGroup = supportedVersionGroups[0];
            setGame(defaultGroup.api_path);
        }

        setInitialised(true);
    }, [setGame]);

    useEffect(() => {
        if (initialised && versionGroup) {
            getPokedexes();
        }
    }, [initialised, versionGroup, getPokedexes]);

    if (!initialised || !generation || !versionGroup || !version) {
        return null;
    }

    return (
        <VersionContext.Provider value={contextValue}>
            {children}
        </VersionContext.Provider>
    );
}