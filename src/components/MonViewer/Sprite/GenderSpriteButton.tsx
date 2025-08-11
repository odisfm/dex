import MaleIcon from "../../../icon/gender-male.svg?react"
import FemaleIcon from "../../../icon/gender-female.svg?react"
import type {ReactElement} from "react";

export default function GenderSpriteButton({gender, toggleGender}: {gender: "male" | "female", toggleGender: () => void}): ReactElement {
    return (
        <button
            onClick={toggleGender}
            className={
                `relative transition-all duration-75 bg-white hover:bg-black 
            group size-md rounded-full top-5 p-2 
            z-9 cursor-pointer self-center justify-self-end [&>svg]:size-7`
            }
        >
            { gender === "male" ? <MaleIcon className={"fill-sky-300"}/> : <FemaleIcon className={"fill-pink-300"}/> }
        </button>
    )
}