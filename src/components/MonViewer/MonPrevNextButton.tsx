import {Link} from "react-router-dom";

export default function MonPrevNextButton({left = true, url}: { left: boolean, url: string }) {
    return (
        <Link to={url}
              className={"cursor-pointer bg-white text-black hover:bg-black hover:text-white size-14 rounded-full flex items-center justify-center p-2 font-bold"}> {left ? "<" : ">"} </Link>
    )
}