import EditorView from "./editor"
import { WidgetMaker } from "@/view/article/types"
import React from "react"

class TextWidget extends WidgetMaker {
    make(name: string, data: unknown): React.ReactNode {
        if (name === "editor") return <EditorView />

        return super.make(name, data)
    }
}

export default new TextWidget()
