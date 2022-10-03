import * as React from "react"
import BlackBoardView from "@/view/black-board/black-board-view"
import { useDebouncedEffect } from "@/hook/debounced-effect"
import { useLocalStorageState } from "@/hook/local-storage-state"
import "./editor-view.css"

export interface EditorViewProps {
    className?: string
}

export default function EditorView(props: EditorViewProps) {
    const [value, setValue] = useLocalStorageState("", "widget/g/editor/value")
    const [code, setCode] = React.useState(value)
    useDebouncedEffect(() => setCode(value), 1000, [value])
    return (
        <div className={getClassNames(props)}>
            <textarea
                spellCheck={false}
                rows={8}
                value={value}
                onChange={(evt) => setValue(evt.target.value)}
            ></textarea>
            <BlackBoardView children={code} />
        </div>
    )
}

function getClassNames(props: EditorViewProps): string {
    const classNames = ["custom", "widget-g-EditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
