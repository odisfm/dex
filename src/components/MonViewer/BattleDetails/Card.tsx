import type {ReactElement, ReactNode} from "react";

export default function Card({children, extraStyles="", id}: {children: ReactNode, extraStyles: string | null, id: string | null}): ReactElement {
    return (
        <div id={id || undefined} className={`flex flex-col gap-3 items-center bg-white px-8 py-5 [&_h3]:font-bold [&_h3]:text-3xl md:self-start ${extraStyles}`}>
            {children}
        </div>
    )
}