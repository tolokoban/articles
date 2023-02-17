import { WidgetMaker } from "@/view/article/types"
import { ReactNode } from "react"
import Keys from "./keys.json"
import Styles from "./compose-keys.module.css"

const Groups = Keys as unknown as {
    [name: string]: {
        [text: string]: Array<[value: string, description: string]>
    }
}

class ComposeKeyWidget implements WidgetMaker {
    make(name: string, data: unknown): ReactNode {
        return (
            <div className={Styles.ComposeKeys}>
                {Object.keys(Groups).map((groupName) => (
                    <Group
                        key={groupName}
                        label={groupName}
                        value={Groups[groupName]}
                    />
                ))}
            </div>
        )
    }
}

function Group({
    label,
    value,
}: {
    label: string
    value: {
        [text: string]: Array<[value: string, description: string]>
    }
}) {
    return (
        <details>
            <summary>{label}</summary>
            {Object.keys(value).map((text) => {
                const [[keys, desc]] = value[text]
                return (
                    <a key={text} id={text} title={`${keys} (${desc})`}>
                        {text}
                    </a>
                )
            })}
        </details>
    )
}

function Grid({
    value,
}: {
    value: Array<[value: string, description: string]>
}) {
    return <div></div>
}

export default new ComposeKeyWidget()
