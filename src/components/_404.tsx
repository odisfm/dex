import type {ReactElement} from "react";
import {Link} from "react-router-dom";

export default function _404(): ReactElement {
    return (
        <div className={" bg-white py-4 px-10 rounded-lg w-lg flex flex-col items-center gap-4"}>
            <h1 className={"text-3xl font-bold"}>Oh no! :(</h1>
            <p>
                Couldn't find the requested page.
            </p>
            <Link to={"/"}
                  className={"font-bold px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md"}>Home</Link>
        </div>
    )
}