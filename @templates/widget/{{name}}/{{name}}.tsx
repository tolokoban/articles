import { WidgetMaker } from "@/view/article/types"
import React from "react"
import { isObject } from "@/tool/validator"
import Style from "./{{name}}.module.css"

class {{name}}Widget extends WidgetMaker {
    make(name: string, data: unknown): React.ReactNode {
        if (name === "{{name}}") {
            if (!is{{name}}Props(data)) {
                throw Error(`Invalid type for {{name}}!`)
            }
            return <{{name}}View data={data} />
        }
        return super.make(name, data)
    }
}

export default new {{name}}Widget()

type {{name}}Props = {}

function is{{name}}Props(data: unknown): data is {{name}}Props {
    if (!isObject(data)) return false
    return true
}

function {{name}}View({data}: {data: {{name}}Props}) {
    return <div className={Style.{{name}}}></div>
}

