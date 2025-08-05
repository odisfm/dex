import {supportedVersionGroups, supportedGenerations, supportedVersions} from "../../versionData.tsx";
import type {PokeAPI} from "pokeapi-types";

const versionPriorityList = supportedVersionGroups.map(versionGroup => versionGroup.api_path);

class NoRelevantVersionError extends Error {}


export function getMoveLearnDetails(data: PokeAPI.PokemonMove, targetVersionGroup: string): PokeAPI.PokemonMoveVersion {
    let mostRelevantEntry = null;
    let mostRelevantVersionPriority = -1
    const targetVersionIndex = versionPriorityList.indexOf(targetVersionGroup);
    for (const item of data.version_group_details) {
        const versionGroupName = item.version_group.name
        if (versionGroupName === targetVersionGroup) {
            return item;
        }
        const versionPriority = versionPriorityList.indexOf(versionGroupName);
        if (versionPriority < targetVersionIndex && versionPriority > mostRelevantVersionPriority) {
            mostRelevantEntry = item;
            mostRelevantVersionPriority = versionPriority
        }
    }
    if (mostRelevantEntry === null) {
        throw new NoRelevantVersionError(`Unable to parse move learn details`);
    }

    return mostRelevantEntry;
}

export function getSpeciesFlavorText(data: PokeAPI.FlavorText[], targetVersion: string, targetLanguage="en"): PokeAPI.FlavorText {
    let mostRelevantEntry = null;
    let mostRelevantVersionPriority = -1;
    const targetVersionIndex = supportedVersions.indexOf(targetVersion);
    for (const flavorEntry of data) {
        if (flavorEntry.language.name === targetLanguage && flavorEntry.version.name === targetVersion) {
            return flavorEntry;
        }
        const versionPriority = supportedVersions.indexOf(flavorEntry.version.name)
        if (flavorEntry.language.name !== targetLanguage) {
            continue;
        }
        if (versionPriority > mostRelevantVersionPriority && versionPriority < targetVersionIndex) {
            mostRelevantEntry = flavorEntry;
            mostRelevantVersionPriority = versionPriority;
        }
    }
    if (mostRelevantEntry) {
        return mostRelevantEntry;
    }
    throw new NoRelevantVersionError(`Unable to parse flavor text`);
}

type APIPastTypes = {
    generation: {
        name: string;
    },
    types: PokeAPI.PokemonType[],
}

export function getTypes(currentTypes: PokeAPI.PokemonType[], pastTypes: APIPastTypes[], targetGen: string): PokeAPI.PokemonType[] {
    let mostRelevantEntry = null;
    let mostRelevantVersionPriority = -1;
    const targetGenPriority = supportedGenerations.indexOf(targetGen)
    for (const pastType of pastTypes) {
        const thisGenPriority = supportedGenerations.indexOf(pastType.generation.name)
        if (thisGenPriority === targetGenPriority) {
            return pastType.types;
        }
        if (thisGenPriority > mostRelevantVersionPriority && thisGenPriority >= targetGenPriority) {
            mostRelevantEntry = pastType
            mostRelevantVersionPriority = thisGenPriority;
        }
    }
    return mostRelevantEntry ? mostRelevantEntry.types: currentTypes;
}

type MovePlusLearnDef = {
    level_learned_at: number,
    move_learn_method: PokeAPI.NamedAPIResource,
    order?: null | number,
    name: string,
    url: string
}

export function getAllVersionMoves(allMoves: PokeAPI.PokemonMove[], versionGroup: string): MovePlusLearnDef[] {
    const allRelevantMoves: MovePlusLearnDef[] = [];
    for (const moveLearnDef of allMoves) {
        try {
            const relevantMove = getMoveLearnDetails(moveLearnDef, versionGroup);
            allRelevantMoves.push({...moveLearnDef.move, ...relevantMove});

        } catch (error) {
            if (error instanceof NoRelevantVersionError) {
                continue;
            }
            throw error;
        }
    }
    return allRelevantMoves
}

type APIPastAbilities = {
    abilities: PokeAPI.Ability[],
    generation: PokeAPI.NamedAPIResource,
}

export function getAbilities(currentAbilities: PokeAPI.Ability[], pastAbilities: APIPastAbilities[], targetGen: string): PokeAPI.Ability[] {
    let mostRelevantEntry = null;
    let mostRelevantVersionPriority = -1;
    const targetGenPriority = supportedGenerations.indexOf(targetGen);

    for (const abilitiesDef of pastAbilities) {

        if (abilitiesDef.generation.name === targetGen) {
            return abilitiesDef.abilities;
        }

        const genPriority = supportedGenerations.indexOf(abilitiesDef.generation.name);

        if (genPriority > mostRelevantVersionPriority && genPriority > targetGenPriority) {
            mostRelevantEntry = abilitiesDef.abilities;
            mostRelevantVersionPriority = genPriority;
        }
    }

    if (mostRelevantEntry) {
        return mostRelevantEntry;
    }

    return currentAbilities;
}

export function getLocalName(data: PokeAPI.Name[], targetLanguage: string, fallbackLanguage="en"): string {
    let fallbackResult = null;
    for (const nameDef of data) {
        if (nameDef.language.name === targetLanguage) {
            return nameDef.name
        } else if (nameDef.language.name === fallbackLanguage) {
            fallbackResult = nameDef.name;
        }
    }
    if (fallbackResult) {
        return fallbackResult;
    }
    throw new NoRelevantVersionError(`no name entry matching targetLanguage "${targetLanguage} or fallbackLanguage ${fallbackLanguage}`)
}
