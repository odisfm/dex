import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import dex from "../../utils/dex"
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {MonListItem} from "./MonListItem.tsx";
import {supportedVersionGroups} from "../../../versionData.tsx";
import {generationIncrement} from "../../utils/util.ts";

const PER_PAGE = 30

export type MonPlusSpecies = {
    mon: PokeAPI.Pokemon,
    species: PokeAPI.PokemonSpecies,
}

export default function DexList({pokedex}: { pokedex: PokeAPI.Pokedex | null }): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const [loadedMon, setLoadedMon] = useState<MonPlusSpecies[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [natVersionCount, setNatVersionCount] = useState<number>(151);

    const lastItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoadedMon([])
        setPage(0)
        setHasMore(true)
        for (const vg of supportedVersionGroups) {
            if (vg.api_path === versionContext.versionDetails.versionGroup) {
                setNatVersionCount(vg.mon_count)
                break;
            }
        }
    }, [pokedex, versionContext.versionDetails.versionGroup]);

    const fetchMoreMon = useCallback(async () => {
        if (!pokedex || loading || !hasMore) {
            return;
        }

        setLoading(true);

        try {
            const toFetch: string[] = [];
            const startIndex = PER_PAGE * page
            let endIndex = PER_PAGE * (page + 1)

            if (pokedex.name === "national" && endIndex > natVersionCount) {
                endIndex = natVersionCount
            }

            if (startIndex >= pokedex.pokemon_entries.length) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const entriesToFetch = pokedex.pokemon_entries.slice(startIndex, endIndex);

            if (entriesToFetch.length < PER_PAGE) {
                setHasMore(false);
            }

            entriesToFetch.forEach(entry => {
                toFetch.push(entry.pokemon_species.url)
            })

            const fetchedSpecies: PokeAPI.PokemonSpecies[] = await dex.resource(toFetch)
            let fetchedMon: PokeAPI.Pokemon[] = [];
            const monUrl = fetchedSpecies.map((spec) => {
                return spec.varieties[0].pokemon.url
            })
            fetchedMon = await dex.resource(monUrl) as PokeAPI.Pokemon[]
            const monPlusSpecies: MonPlusSpecies[] = [];

            for (let i = 0; i < fetchedSpecies.length; i++) {
                monPlusSpecies.push({
                    mon: fetchedMon[i],
                    species: fetchedSpecies[i],
                })
            }

            setLoadedMon(prevLoadedMon => [...prevLoadedMon, ...monPlusSpecies])
            setPage(prevPage => prevPage + 1)
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
        } finally {
            setLoading(false);
        }
    }, [page, pokedex, loading, hasMore, natVersionCount]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const lastItem = entries[0];
                if (lastItem.isIntersecting && hasMore && !loading) {
                    fetchMoreMon();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        );

        const lastRef = lastItemRef.current;

        if (lastItemRef.current) {
            observer.observe(lastItemRef.current);
        }

        return () => {
            if (lastRef) {
                observer.unobserve(lastRef);
            }
        };
    }, [fetchMoreMon, hasMore, loading]);

    useEffect(() => {
        if (pokedex && loadedMon.length === 0 && !loading) {
            fetchMoreMon();
        }
    }, [pokedex, loadedMon.length, fetchMoreMon, loading]);

    const nextGen: string | false = useMemo(() => {
        try {
            return generationIncrement(versionContext.versionDetails.generation, 1)
        } catch {
            return false
        }
    }, [versionContext.versionDetails.generation]);

    const setNextGen = useCallback(() => {
        if (!nextGen) {
            return
        }
        versionContext.setGeneration(nextGen)
    }, [nextGen, versionContext])

    return (
        <div className={"flex flex-col items-center justify-center w-full md:w-lg"}>
            <div className={"flex flex-col gap-1 w-full"}>
                {loadedMon.map((mon, index) => {
                    const isLast = index === loadedMon.length - 1;
                    return (
                        <div
                            key={`${mon.species.id}-${index}`}
                            ref={isLast ? lastItemRef : null}
                        >
                            <MonListItem
                                key={`${mon.mon.name}-${index}`}
                                monPlusSpecies={mon}
                                dexNum={pokedex?.pokemon_entries[index]?.entry_number || index + 1}
                            />
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <div className="text-gray-500">Loading more Pokémon...</div>
                    </div>
                )}

                {!loading && !hasMore && loadedMon.length > 0 && (
                    <div className="flex justify-center items-center p-4">
                        <div className="flex flex-col gap-3 text-gray-500 items-center">
                            <span className={"m-2"}>You've seen all Pokémon in this Pokédex! </span>
                            <div className={"flex gap-4 "}>
                                <a href={"#"}
                                   className={"font-bold hover:underline p-2 hover:bg-gray-200 rounded-md cursor-pointer"}>back
                                    to top</a>
                                {(pokedex?.name === "national" && nextGen) ?
                                    <button
                                        className={"font-bold hover:underline p-2 hover:bg-gray-200 rounded-md cursor-pointer"}
                                        onClick={setNextGen}>next generation</button>
                                    : null
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}