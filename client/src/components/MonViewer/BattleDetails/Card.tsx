import type {ReactElement} from "react";

export default function Card({children}: {children: React.ReactNode}): ReactElement {
    return (
        <div className={"flex flex-col items-center bg-white px-8 py-3 [&_h3]:font-bold [&_h3]:text-2xl "}>
            {children}
        </div>
    )
}