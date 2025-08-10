import type {ReactElement} from "react";

export default function Card({children, extraStyles=""}: {children: React.ReactNode, extraStyles: string}): ReactElement {
    return (
        <div className={`flex flex-col gap-3 items-center bg-white px-8 py-5 [&_h3]:font-bold [&_h3]:text-3xl md:self-start ${extraStyles}`}>
            {children}
        </div>
    )
}