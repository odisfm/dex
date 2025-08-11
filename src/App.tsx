import VersionPicker from "./components/VersionPicker.tsx";
import {Link, Outlet} from "react-router-dom";
import LanguagePicker from "./components/LanguagePicker.tsx";
// @ts-expect-error "path"
import GithubIcon from "./icon/github.svg?react"

function App() {

    return (
        <>
            <header className={"z-100 sticky top-0 p-1 text-white gap-2 md:gap-10 bg-slate-800 flex items-center max-w-screen"}>
                <a href={"/#"} className={"p-2 md:px-3 lg:px-5 rounded-md hover:bg-slate-700"}><h1 className={"text-3xl font-black"}>Dex</h1></a>
                <div className={"flex gap-3 w-full"}>
                    <VersionPicker/>
                    <LanguagePicker/>
                </div>
            </header>
            <div className={"relative h-full w-full"}>
                <main className={"bg-gray-100 flex flex-col gap-3 h-full w-full min-h-screen items-center py-5 px-3 md:px-10 text-black"}>
                    <Outlet></Outlet>
                </main>
            </div>
            <footer className={"flex bg-slate-800 px-10 py-3 text-white h-max-20 items-center"}>
                <Link to={"https://github.com/odisfm/dex"} className={"group rounded-md px-3 py-1 hover:bg-slate-900"}>
                <span className={"flex gap-2 fill-white"}>
                    <div className={"size-6 "}><GithubIcon/></div>
                    View source
                </span>
                </Link>
                <span className={"ml-auto"}>Powered by <a className={"font-bold hover:underline"} href={"https://pokeapi.co"}>PokeApi</a></span>
            </footer>
        </>

    )
}

export default App
