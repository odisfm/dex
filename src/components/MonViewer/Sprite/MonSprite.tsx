import type {PokeAPI} from "pokeapi-types";
import {type ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {VersionContext} from "../../../contexts/VersionContext.tsx";
import {getSprites} from "../../../utils/apiParsing.ts";
import {
    typePalettesDark,
    typePalettesMid,
    typesBorder,
    typesBorderHover,
    typesGradientDouble,
    typesGradientEnd,
    typesGradientStart
} from "../../../utils/typePalettes.tsx";
import {compareGenerations} from "../../../utils/util.ts";
import ShinyButton from "./ShinyButton.tsx";
import GenderSpriteButton from "./GenderSpriteButton.tsx";

export default function MonSprite({mon, monSpecies, monTypes}: {
    mon: PokeAPI.Pokemon,
    monSpecies: PokeAPI.PokemonSpecies,
    monTypes: PokeAPI.PokemonType[]
}): ReactElement {
    const [activeSprite, setActiveSprite] = useState<string | undefined>(undefined);
    const versionContext = useContext(VersionContext)
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [shiny, setShiny] = useState<boolean>(false);
    const [hasGenderSprite, setHasGenderSprite] = useState<boolean>(false);
    const [gender, setGender] = useState<"male" | "female">("male");
    const [imgIsLoading, setImgIsLoading] = useState(true);

    useEffect(() => {
        const imageElement = imageRef.current;
        if (!imageElement || !activeSprite) {
            if (!activeSprite) {
                setImgIsLoading(false);
            }
            return
        }

        setImgIsLoading(true);

        const handleLoad = () => {
            setImgIsLoading(false);
        };

        const handleError = () => {
            setImgIsLoading(false);
        };

        imageElement.addEventListener('load', handleLoad);
        imageElement.addEventListener('error', handleError);

        if (imageElement.complete && imageElement.naturalHeight !== 0) {
            setImgIsLoading(false);
        }

        return () => {
            imageElement.removeEventListener('load', handleLoad);
            imageElement.removeEventListener('error', handleError);
        };
    }, [activeSprite, imageRef]);


    useEffect(() => {
        const load = async () => {
            if (!mon || !imageRef.current) {
                return;
            }
            setActiveSprite(undefined)
            let sprites;
            try {
                sprites = getSprites(mon.sprites, versionContext.versionDetails.generation, versionContext.versionDetails.versionGroup, versionContext.versionDetails.version)
                if (sprites["front_female"]) {
                    setHasGenderSprite(true)
                } else {
                    setHasGenderSprite(false)
                }
            } catch (e) {
                console.error(e)
            }
            let key: string;
            let fallbackKey: string;
            if (sprites) {
                let overrideSprite: string;
                if (versionContext.versionDetails.generation === "generation-i") {
                    key = "front_transparent"
                } else if (versionContext.versionDetails.generation === "generation-ii") {
                    if (!shiny) {
                        key = "front_transparent"
                    } else {
                        overrideSprite = mon.sprites.versions["generation-ii"].crystal.front_shiny_transparent;
                    }
                } else if (monSpecies.has_gender_differences) {
                    if (!shiny) {
                        if (gender === "male") {
                            key = "front_default"
                        } else {
                            key = "front_female"
                            fallbackKey = "front_default"
                        }
                    } else {
                        if (gender === "male") {
                            key = "front_shiny"
                        } else {
                            key = "front_shiny_female"
                            fallbackKey = "front_shiny"
                        }
                    }
                } else {
                    key = shiny ? "front_shiny" : "front_default";
                }
                let sprite

                if (!overrideSprite) {
                    sprite = sprites[key as keyof typeof sprites] as string;
                } else {
                    sprite = overrideSprite;
                }

                if (!sprite) {
                    sprite = sprites[fallbackKey as keyof typeof sprites] as string;
                }

                setActiveSprite(sprite)
            } else {
                setActiveSprite(undefined);
            }
        };
        load().then(() => {
        });

    }, [mon, monSpecies.has_gender_differences, versionContext, shiny, gender, hasGenderSprite]);

    const postGen3 = compareGenerations(versionContext.versionDetails.generation, "generation-iii") >= 0;

    let gradientStart: string;
    let gradientEnd: string;
    let borderClass;
    let borderHoverClass;
    let shadowClass

    if (postGen3) {
        gradientStart = typesGradientStart[monTypes[0].type.name as keyof typeof typesGradientStart];
        if (monTypes.length > 1) {
            gradientEnd = typesGradientEnd[monTypes[1].type.name as keyof typeof typesGradientEnd];
        } else {
            gradientEnd = typesGradientDouble[monTypes[0].type.name as keyof typeof typesGradientEnd];
        }

        borderClass = imgIsLoading ? "border-stone-300" : typesBorder[monTypes[0].type.name as keyof typeof typesBorder];
        borderHoverClass = typesBorderHover[monTypes[0].type.name as keyof typeof typesBorderHover];
        shadowClass = typePalettesDark[monTypes[0].type.name as keyof typeof typePalettesDark];
    } else {
        gradientStart = "from-white"
        gradientEnd = "to-white"
        borderClass = "border-gray-200"

    }

    const bgColor = typePalettesMid[monTypes[0].type.name as keyof typeof typePalettesMid]

    const toggleShiny = useCallback(() => {
        setShiny(!shiny)
    }, [shiny])

    const toggleGender = useCallback(() => {
        setGender(gender === "male" ? "female" : "male")
    }, [gender])

    return (
        <>

            <div className={"flex justify-center items-center relative"}>
                <div
                    className={`group relative overflow-hidden rounded-full h-60 w-60 flex items-center border-5 ${borderClass} ${borderHoverClass} animate-all duration-1000`}>
                    <img
                        className={`z-30 absolute left-3 pixel-image object-contain size-50 hover:saturate-120 ${imgIsLoading ? " opacity-0 " : " "}`}
                        src={activeSprite ? activeSprite : undefined}
                        ref={imageRef}
                    />

                    <div className={`z-9 absolute top-15 inset-0 h-80 w-100 ${shadowClass} opacity-10 rounded-full `}>

                    </div>
                    <div
                        className={`absolute inset-0 bg-radial ${gradientStart} ${gradientEnd}`}>
                    </div>
                    <div
                        className={`absolute inset-0  opacity-0 group-hover:opacity-60 group-hover:animate-[spin_4s_ease-in-out] transition-all duration-500 ease-in-out bg-radial-[at_25%_75%] ${gradientStart} ${gradientEnd}`}></div>
                </div>
                <div className="absolute bottom-1/2 left-0 -translate-x-1/2 z-20 flex flex-col gap-2">
                    {
                        hasGenderSprite ?
                            <GenderSpriteButton gender={gender} toggleGender={toggleGender}/>
                            : null
                    }
                    {versionContext.versionDetails.generation === "generation-i" ? null :
                        <ShinyButton isShiny={shiny} toggleShiny={toggleShiny} bgColor={bgColor}/>
                    }
                </div>
            </div>
        </>
    )
}