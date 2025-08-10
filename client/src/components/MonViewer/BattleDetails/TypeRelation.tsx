import {type ReactElement, useMemo} from "react";
import {TypeLabel} from "../../TypeLabel.tsx";

export default function TypeRelation({typeName, mode, relation}: {
    typeName: string,
    mode: "attack" | "defend",
    relation: number
}): ReactElement {

    const styles = useMemo(() => {
        let textColor;
        if (mode === "attack") {
            if (relation === 1) {
                textColor = "text-black";
            } else if (relation > 1) {
                if (relation >= 2) {
                    textColor = "text-green-400";
                } else {
                    textColor = "text-green-600";
                }
            } else if (relation < 1) {
                if (relation === 0) {
                    textColor = "text-red-400";
                } else {
                    textColor = "text-red-600";
                }
            }
        } else if (mode === "defend") {
            if (relation === 1) {
                textColor = "text-black";
            } else if (relation > 1) {
                if (relation >= 4) {
                    textColor = "text-red-300";
                } else if (relation >= 2) {
                    textColor = "text-red-400";
                } else {
                    textColor = "text-red-500";
                }
            } else if (relation < 1) {
                if (relation === 0) {
                    textColor = "text-green-400";
                } else {
                    textColor = "text-green-600";
                }
            }
        }
        return {
            textColor
        }
        }, [mode, relation])

    return (
        <div className={"flex gap-1 p-2"}>
            <TypeLabel pokeType={typeName} size={"sm"} /> <span className={`${styles.textColor} `}>X {relation}</span>
        </div>
    )
}