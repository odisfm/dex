import React, {useContext} from "react";
import {VersionContext} from "../contexts/VersionContext.tsx";
import {supportedVersionGroups} from "../../versionData.tsx";

export default function VersionChooser(): React.ReactElement {
    const versionContext = useContext(VersionContext)

    return <div
        className={"flex flex-wrap size-lg gap-2"}>
        {supportedVersionGroups.map((group) => {
            return <button
                className={"bg-white text-lg text-black rounded-md p-2"}
                onClick={() => {
                    console.log(group);
                    versionContext.setVersionGroup(group.api_path)
                }}
            >
                {group.name}
            </button>
        })}
    </div>
}