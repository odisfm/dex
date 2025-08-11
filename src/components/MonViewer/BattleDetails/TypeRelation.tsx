import {type ReactElement, useMemo} from "react";
import {TypeLabel} from "../../TypeLabel.tsx";

export default function TypeRelation({typeName, mode, relation}: {
    typeName: string,
    mode: "attack" | "defend",
    relation: number
}): ReactElement {

    const styles = useMemo(() => {
        let bgColor;
        if (mode === "attack") {
            if (relation === 1) {
                bgColor = "text-black";
            } else if (relation > 1) {
                if (relation >= 2) {
                    bgColor = "bg-lime-500";
                } else {
                    bgColor = "bg-lime-600";
                }
            } else if (relation < 1) {
                if (relation === 0) {
                    bgColor = "bg-red-700";
                } else {
                    bgColor = "bg-red-600";
                }
            }
        } else if (mode === "defend") {
            if (relation === 1) {
                bgColor = "bg-black";
            } else if (relation > 1) {
                if (relation >= 4) {
                    bgColor = "bg-red-600";
                } else if (relation >= 2) {
                    bgColor = "bg-red-500";
                } else {
                    bgColor = "bg-red-400";
                }
            } else if (relation < 1) {
                if (relation === 0) {
                    bgColor = "bg-green-500";
                } else if (relation < 0.5) {
                    bgColor = "bg-lime-500";
                } else {
                    bgColor = "bg-lime-600";
                }
            }
        }
        return {
            bgColor
        }
    }, [mode, relation])

    return (
        <div className={"flex flex-col p-2 gap-1 rounded-md"}>
            <TypeLabel pokeType={typeName} size={"sm"}/> <span
            className={`${styles.bgColor} text-white font-bold px-3 self-stretch rounded-lg `}>X {relation}</span>
        </div>
    )
}