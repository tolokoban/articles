import { WidgetMaker } from "@/view/article/types"
import { ReactNode } from "react"
import Keys from "./keys.json"
import Styles from "./compose-keys.module.css"
import React from "react"

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
    const [current, setCurrent] = React.useState<null | {
        text: string
        details: Array<[value: string, description: string]>
    }>(null)
    return (
        <>
            <details>
                <summary>{label}</summary>
                {Object.keys(value).map((text) => {
                    const [[keys, desc]] = value[text]
                    return (
                        <button
                            key={text}
                            id={text}
                            title={`${keys} (${desc})`}
                            onClick={() =>
                                setCurrent({ text, details: value[text] })
                            }
                        >
                            {text}
                        </button>
                    )
                })}
            </details>
            {current && (
                <div
                    className={Styles.Details}
                    onClick={() => setCurrent(null)}
                >
                    <div>
                        <div>{current.text}</div>
                    </div>
                    <ul>
                        {current.details.map(([value, description], index) => (
                            <li key={`K${index}`}>
                                <b>
                                    <code>{value}</code>
                                </b>
                                : {description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default new ComposeKeyWidget()
