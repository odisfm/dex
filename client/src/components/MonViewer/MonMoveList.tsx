import type { PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useMemo, useState, useRef} from "react";
import {condenseMoveData, getAllVersionMoves, getLocalName} from "../../utils/apiParsing.ts";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {LanguageContext} from "../../contexts/LanguageContext.tsx";
import dex from "../../utils/dex.tsx"
import MonMoveSummary, {type MoveSummaryData} from "./MonMoveSummary.tsx";

const standardLearnMethods = ["level-up", "egg", "machine", "tutor"]
type LearnMethodFilter = "level-up" | "egg" | "machine" | "tutor" | "other" | null

export default function MovMoveList({mon}: {mon: PokeAPI.Pokemon}): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const languageContext = useContext(LanguageContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [moveSummaries, setMoveSummaries] = useState<MoveSummaryData[]>([]);
    const [learnMethodFilter, setLearnMethodFilter] = useState<LearnMethodFilter>("level-up");
    const [localLearnMethodNames, setLocalLearnMethodNames] = useState<string[]>([]);

    const currentFetchRef = useRef<{
        monId: number;
        versionGroup: string;
        language: string;
        fallbackLanguage: string;
    } | null>(null);

    const sortMoves = useCallback((data: MoveSummaryData[]): MoveSummaryData[] => {
        return [...data].sort((a, b) => {
            if (!a.learnDef.level_learned_at && !b.learnDef.level_learned_at) {
                return 0
            } else if (!a.learnDef.level_learned_at) {
                return 1
            } else if (!b.learnDef.level_learned_at) {
                return -1
            }
            if (a.learnDef.level_learned_at === b.learnDef.level_learned_at) {
                return 0
            }
            return a.learnDef.level_learned_at > b.learnDef.level_learned_at ? 1 : -1
        });
    }, []);

    const fetchMoveData = useCallback(async () => {
        const currentParams = {
            monId: mon.id,
            versionGroup: versionContext.versionDetails.versionGroup,
            language: languageContext.language,
            fallbackLanguage: languageContext.fallbackLanguage
        };

        if (currentFetchRef.current &&
            currentFetchRef.current.monId === currentParams.monId &&
            currentFetchRef.current.versionGroup === currentParams.versionGroup &&
            currentFetchRef.current.language === currentParams.language &&
            currentFetchRef.current.fallbackLanguage === currentParams.fallbackLanguage) {
            return;
        }

        currentFetchRef.current = currentParams;

        try {
            setLoading(true);
            setError(null);

            const monMoves = getAllVersionMoves(mon.moves, versionContext.versionDetails.versionGroup);

            if (monMoves.length === 0) {
                setMoveSummaries([]);
                setLoading(false);
                return;
            }

            const moveUrls = monMoves.map(m => m.url);
            const pokemonMoves: PokeAPI.Move[] = await dex.resource(moveUrls) as PokeAPI.Move[];
            const _moveSummaries: MoveSummaryData[] = [];

            for (let i = 0; i < monMoves.length; i++) {
                const move = pokemonMoves[i];
                const learnDef = monMoves[i];

                _moveSummaries.push({
                    condensed: condenseMoveData(
                        move,
                        versionContext.versionDetails.versionGroup,
                        languageContext.language,
                        languageContext.fallbackLanguage
                    ),
                    learnDef: learnDef
                });
            }

            setMoveSummaries(_moveSummaries);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch move data');
            currentFetchRef.current = null;
        } finally {
            setLoading(false);
        }
    }, [
        mon.id,
        mon.moves,
        versionContext.versionDetails.versionGroup,
        languageContext.language,
        languageContext.fallbackLanguage
    ]);

    useEffect(() => {
        let isCancelled = false;

        const runFetch = async () => {
            await fetchMoveData();
            if (isCancelled) {
                currentFetchRef.current = null;
            }
        };

        runFetch();

        return () => {
            isCancelled = true;
        };
    }, [fetchMoveData]);

    const filteredMoves = useMemo((): MoveSummaryData[] => {
        if (moveSummaries.length === 0) {
            return [];
        }

        if (!learnMethodFilter) {
            return sortMoves(moveSummaries);
        }

        let filtered: MoveSummaryData[] = [];
        switch (learnMethodFilter) {
            case null:
                filtered = moveSummaries;
                break;
            case "other":
                filtered = [...moveSummaries].filter(
                    (move) => {
                        return !standardLearnMethods.includes(move.learnDef.move_learn_method.name)
                    })
                break;
            default:
                filtered = [...moveSummaries].filter(
                    (move) => {
                        return move.learnDef.move_learn_method.name === learnMethodFilter
                    })
        }

        if (learnMethodFilter === "level-up" || learnMethodFilter === null) {
            return sortMoves(filtered);
        } else {
            return filtered.sort((a, b) => {
                return a.condensed.name.localeCompare(b.condensed.name);
            });
        }
    }, [moveSummaries, learnMethodFilter, sortMoves]);

    useEffect(() => {
        const loadLocalizedMethods = async () => {
            const localized = await Promise.all(
                standardLearnMethods.map(async (methodName) => {
                    const data = await dex.getMoveLearnMethodByName(methodName);
                    return getLocalName(data.names, languageContext.language, languageContext.fallbackLanguage);
                })
            );
            setLocalLearnMethodNames([...localized, "Other", "All"]);
        };

        loadLocalizedMethods();
    }, [languageContext.language, languageContext.fallbackLanguage]);


    const moveKeys = useMemo(() => {
        return filteredMoves.map(move => `${move.condensed.name}-${move.learnDef.move_learn_method.name}-${move.learnDef.level_learned_at || 'no-level'}`);
    }, [filteredMoves]);

    if (loading) {
        return <span>Loading move data...</span>;
    }

    if (error) {
        return <span>Error: {error}</span>;
    }

    if (moveSummaries.length === 0) {
        return <span>No moves found for this Pokémon in the selected version.</span>;
    }

    return (
        <>
            <h1 className={"text-3xl font-bold"}>Moves</h1>
            <div className={"flex flex-wrap gap-1 justify-center p-2"}>
                {[...standardLearnMethods, "other", null].map((method, index) => {
                    return (
                        <button
                            className={`${method === learnMethodFilter ? "bg-black text-white hover:bg-black " : "bg-white hover:bg-gray-300 "} rounded-md cursor-pointer px-4 py-1`}
                            onClick={() => setLearnMethodFilter(method as LearnMethodFilter)}
                        >
                            {localLearnMethodNames[index]}
                        </button>
                    )
                })
                }
            </div>
            <div className={"flex flex-col gap-2 lg:max-w-4/5 xl:3/5"}>
                {filteredMoves.length ?
                    filteredMoves.map((move, index) => {
                    return <MonMoveSummary move={move} key={moveKeys[index]}/>
                })
                : <h1 className={"font-bold text-xl"}>No moves for this learn method!</h1>
                }
            </div>
        </>
    );
}