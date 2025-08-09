import {type ReactElement, useMemo} from "react";

export function DamageClassLabel({damageClass}: {damageClass: string}): ReactElement {

    const bgClass = useMemo(() => {
        switch (damageClass) {
            case "physical":
                return "bg-amber-700";
            case "special":
                return "bg-blue-600";
            case "status":
                return "bg-indigo-500";
        }
    })

    return (
        <div className={`rounded-md px-2 py-1 font-bold text-white text-xs ${bgClass} `}>
            {damageClass.toUpperCase()}
        </div>
    )
}