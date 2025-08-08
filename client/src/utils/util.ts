import {supportedGenerations, supportedVersionGroups} from "../../versionData.tsx";

export const compareGenerations = (a: string, b: string): -1 | 0 | 1 => {
    const genA = supportedGenerations.indexOf(a);
    const genB = supportedGenerations.indexOf(b);
    if (genA === genB) {
        return 0
    }
    return genA > genB ? 1 : -1;
}

export const compareVersionGroupToGen = (versionGroup: string, generation: string): -1 | 0 | 1 => {
    for (const vg of supportedVersionGroups) {
        if (vg.api_path === versionGroup) {
            return compareGenerations(vg.generation, generation);
        }
    }
    throw new Error("Invalid version group");
}