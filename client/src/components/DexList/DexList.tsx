import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useContext, useEffect, useState, useCallback, useRef} from "react";
import dex from "../../utils/dex"
import {VersionContext} from "../../contexts/VersionContext.tsx";
import {MonListItem} from "./MonListItem.tsx";
import DexButton from "./DexButton.tsx";

const PER_PAGE = 15

export type MonPlusSpecies = {
    mon: PokeAPI.Pokemon,
    species: PokeAPI.PokemonSpecies,
}

export default function DexList({pokedex}: {pokedex: PokeAPI.Pokedex | null}): ReactElement | null {
    const versionContext = useContext(VersionContext);
    const [loadedMon, setLoadedMon] = useState<MonPlusSpecies[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const lastItemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLoadedMon([])
        setPage(0)
        setHasMore(true)
    }, [pokedex]);

    const fetchMoreMon = useCallback(async () => {
        if (!pokedex || loading || !hasMore) {
            return;
        }

        setLoading(true);

        try {
            const toFetch: string[] = [];
            const startIndex = PER_PAGE * page
            const endIndex = PER_PAGE * (page + 1)

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

            console.log(fetchedSpecies)
            console.log(fetchedMon)
            setLoadedMon(prevLoadedMon => [...prevLoadedMon, ...monPlusSpecies])
            setPage(prevPage => prevPage + 1)
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
        } finally {
            setLoading(false);
        }
    }, [page, pokedex, loading, hasMore]);

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

        if (lastItemRef.current) {
            observer.observe(lastItemRef.current);
        }

        return () => {
            if (lastItemRef.current) {
                observer.unobserve(lastItemRef.current);
            }
        };
    }, [fetchMoreMon, hasMore, loading]);

    useEffect(() => {
        if (pokedex && loadedMon.length === 0 && !loading) {
            fetchMoreMon();
        }
    }, [pokedex, loadedMon.length, fetchMoreMon, loading]);

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

                {!hasMore && loadedMon.length > 0 && (
                    <div className="flex justify-center items-center p-4">
                        <div className="text-gray-500">You've seen all Pokémon in this Pokédex! <a href={"#"} className={"font-bold hover:underline"}>Back to top</a></div>
                    </div>
                )}
            </div>
        </div>
    )
}