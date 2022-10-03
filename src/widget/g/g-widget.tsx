import EditorView from "./editor"
import { WidgetMaker } from "@/view/article/types"

class TextWidget implements WidgetMaker {
    make(name: string, data: unknown): JSX.Element {
        if (name !== "editor")
            return (
                <div className="error">
                    Unknown widget <b>{name}</b>!
                </div>
            )

        return <EditorView />
    }
}

export default new TextWidget()
