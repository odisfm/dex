import ShinyIcon from "../../icon/shimmer.svg?react"

export default function ShinyButton({isShiny, toggleShiny}: {isShiny: boolean, toggleShiny: () => void}) {
    return (
        <button
            onClick={toggleShiny}
            className={
            `relative transition-all duration-75 
            group size-md rounded-full top-5 p-2 
            z-9 cursor-pointer self-center justify-self-end 
            ${isShiny ? "bg-white hover:bg-black" : "bg-black hover:bg-white opacity-15 hover:opacity-100 "}
            `
        }
        >
         <ShinyIcon className={`h-8 w-8 ${isShiny ? " fill-black group-hover:fill-white " : "fill-white group-hover:fill-black"}`} />
        </button>
    )
}