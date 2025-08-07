import {supportedGenerations} from "../../versionData.tsx";

export const compareGenerations = (a: string, b: string): -1 | 0 | 1 => {
    const genA = supportedGenerations.indexOf(a);
    const genB = supportedGenerations.indexOf(b);
    if (genA === genB) {
        return 0
    }
    return genA > genB ? 1 : -1;
}
