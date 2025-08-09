import type { PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {condenseMoveData, getAllVersionMoves} from "../../utils/apiParsing.ts";
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {LanguageContext} from "../../contexts/LanguageContext.tsx";
import dex from "../../utils/dex.tsx"
import MonMoveSummary, {type MoveSummaryData} from "./MonMoveSummary.tsx";

export default function MovMoveList({mon}: {mon: PokeAPI.Pokemon}): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const languageContext = useContext(LanguageContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [moveSummaries, setMoveSummaries] = useState<MoveSummaryData[]>([]);
    const [learnMethodFilter, setLearnMethodFilter] = useState<null | string>("level-up");

    useEffect(() => {
        const fetchMoveData = async () => {
            try {
                setLoading(true);
                setError(null);

                const monMoves = getAllVersionMoves(mon.moves, versionContext.versionDetails.versionGroup);

                if (monMoves.length === 0) {
                    setLoading(false);
                    return;
                }

                const moveUrls = monMoves.map(m => {
                    return m.url
                })
                const pokemonMoves: PokeAPI.Move[] = await dex.resource(moveUrls) as PokeAPI.Move[];
                const _moveSummaries: MoveSummaryData[] = [];


                for (let i = 0; i < monMoves.length; i++) {
                    const move = pokemonMoves[i];
                    const learnDef = monMoves[i]

                    _moveSummaries.push({
                        condensed: condenseMoveData(
                            move,
                            versionContext.versionDetails.versionGroup,
                            languageContext.language,
                            languageContext.fallbackLanguage
                        ),
                        learnDef: learnDef
                    })
                }

                setMoveSummaries(_moveSummaries);

                const levelMoves: MoveSummaryData[] = [];
                const machineMoves: MoveSummaryData[] = [];

                for (let i = 0; i < _moveSummaries.length; i++) {
                    const move = _moveSummaries[i];
                    if (move.learnDef.level_learned_at) {
                        levelMoves.push(move)
                    } else {
                        machineMoves.push(move)
                    }
                }

                setMoveSummaries(_moveSummaries);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch move data');
            } finally {
                setLoading(false);
            }
        };

        fetchMoveData();
    }, [mon, versionContext, languageContext]);

    const sortMoves = (data: MoveSummaryData[]): MoveSummaryData[] => {
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
        }

    const filteredMoves = useMemo((): MoveSummaryData[] => {
        if (!learnMethodFilter) {
            return sortMoves(moveSummaries);
        }

        if (learnMethodFilter === "level-up") {
            return sortMoves(
                [...moveSummaries].filter(move => {
                return move.learnDef.move_learn_method.name === "level-up"
                })
            )
        } else {
            return [...moveSummaries].filter(move => {
                return move.learnDef.move_learn_method.name === learnMethodFilter
            }).sort((a, b) => {
                return a.condensed.name.localeCompare(b.condensed.name);
            })
        }
    }, [moveSummaries, learnMethodFilter])


    // const filteredMoves



    if (loading) {
        return <span>Loading move data...</span>;
    }

    if (error) {
        return <span>Error: {error}</span>;
    }

    if (!moveSummaries) {
        return null;
    }

    console.log(moveSummaries);

    return (
        <div className={"flex flex-col gap-1"}>
            {filteredMoves.map((move) => {
                return <MonMoveSummary move={move} key={move.condensed.name}/>
            })}
        </div>
    );
}
