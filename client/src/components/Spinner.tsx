import PokeballIcon from "../icon/pokeball.svg?react"
import type {ReactElement} from "react";

export default function Spinner(): ReactElement {
    return (
        <div className={" animate-bounce size-30 fill-slate-700"}>
            <div className={"animate-spin"}><PokeballIcon/></div>
        </div>
    )
}