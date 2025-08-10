import React, {useContext, useMemo} from "react";
import {VersionContext} from "../contexts/VersionContext.tsx";
import {supportedVersionGroups} from "../../versionData.tsx";
import {compareGenerations} from "../utils/util.ts";

export default function VersionPicker(): React.ReactElement {
    const versionContext = useContext(VersionContext)

    const availableVersionGroups = useMemo(() => {
        if (versionContext.restrictGeneration === null) {
            return supportedVersionGroups;
        }
        return supportedVersionGroups.filter((versionGroup) => {
            const compare = compareGenerations(versionGroup.generation, versionContext.restrictGeneration as string);
            return compare >= 0;
        })
    }, [versionContext.restrictGeneration]);

    return <>
        <select
            onChange={(e) => {
                versionContext.setVersionGroup(e.target.value);
            }}
            className={"shrink-2 min-w-1 max-w-40 md:max-w-1/4"}
            value={versionContext.versionDetails.versionGroup}
        >
            {availableVersionGroups.map((group) => {
                return <option
                    key={group.api_path}
                    value={group.api_path}
                >
                    {group.name}
                </option>
            })}
        </select>
        {/*<div className={"flex gap-1"}>*/}
        {/*    {versionContext.versionDetails.groupVersions.length > 1 ?*/}
        {/*        versionContext.versionDetails.groupVersions.map((version) => {*/}
        {/*        return <button*/}
        {/*            key={version}*/}
        {/*            className={`px-2 py-1 rounded-md*/}
        {/*                ${versionContext.versionDetails.version === version ? "bg-gray-200 text-black" : "bg-slate-700 hover:bg-slate-600 text-white"}`}*/}
        {/*            onClick={() => versionContext.setVersion(version)}*/}
        {/*        >*/}
        {/*            {version.toUpperCase()}*/}
        {/*        </button>*/}
        {/*    })*/}
        {/*    : null*/}
        {/*    }*/}
        {/*</div>*/}
    </>
}