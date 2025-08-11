// @ts-expect-error "path"
import ShinyIcon from "../../../icon/shimmer.svg?react"

export default function ShinyButton({isShiny, toggleShiny, bgColor}: {isShiny: boolean, toggleShiny: () => void, bgColor: string}) {
    return (
        <button
            onClick={toggleShiny}
            className={
            `relative transition-all duration-75 
            group size-md rounded-full top-5 p-2 
            z-9 cursor-pointer self-center justify-self-end 
            ${isShiny ? "bg-white hover:bg-black" : `${bgColor} hover:bg-white opacity-90 hover:opacity-100 `}
            `
        }
        >
         <ShinyIcon className={`h-8 w-8 ${isShiny ? " fill-black group-hover:fill-white " : "fill-white group-hover:fill-black"}`} />
        </button>
    )
}