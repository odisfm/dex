import React, {useContext} from "react";
import {VersionContext} from "../contexts/VersionContext.tsx";
import {supportedVersionGroups} from "../../versionData.tsx";

export default function VersionChooser(): React.ReactElement {
    const versionContext = useContext(VersionContext)

    return <>
        <select
            onChange={(e) => {
                versionContext.setVersionGroup(e.target.value);
            }}
            className={"shrink-1 min-w-1"}>
            {supportedVersionGroups.map((group) => {
                return <option
                    value={group.api_path}
                >
                    {group.name}
                </option>
            })}
        </select>
        <div className={"flex gap-1"}>
            {versionContext.groupVersions.length > 1 ?
                versionContext.groupVersions.map((version) => {
                return <button
                    className={`px-2 py-1 rounded-md
                        ${versionContext.version === version ? "bg-gray-200 text-black" : "bg-slate-700 hover:bg-slate-600 text-white"}`}
                    onClick={() => versionContext.setVersion(version)}
                >
                    {version.toUpperCase()}
                </button>
            })
            : null
            }
        </div>
    </>
}