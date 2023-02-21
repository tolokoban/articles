import * as React from "react"
import ArticleView from "./view/article/article-view"
import { createRoot } from "react-dom/client"
import "./fonts/dosis.css"
import "./index.css"

function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(
        <React.StrictMode>
            <ArticleView
                widgets={{
                    g: import("./widget/g"),
                    "balanced-targets": import("./widget/balanced-targets"),
                    "compose-keys": import("./widget/compose-keys"),
                    "kung-fu-master": import("./widget/games/KungFuMaster"),
                }}
            />
        </React.StrictMode>
    )
}

start()
