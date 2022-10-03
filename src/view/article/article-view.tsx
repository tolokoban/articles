import * as React from "react"
import Markdown from "markdown-to-jsx"
import { ArticleContent, WidgetMaker } from "./types"
import { loadArticleContent } from "./loader"
import { process } from "./processor"
import { useHash } from "./hook/hash"
import "./article-view.css"

export interface ArticleViewProps {
    className?: string
    widgets: { [key: string]: Promise<{ default: WidgetMaker }> }
}

export default function ArticleView(props: ArticleViewProps) {
    const [busy, setBusy] = React.useState(false)
    const refContainer = React.useRef<HTMLDivElement | null>(null)
    const refArticle = React.useRef<ArticleContent>({
        base: "",
        content: "",
        lang: "",
        topic: "",
    })
    const [content, setContent] = React.useState<React.ReactNode>(null)
    const topic = useHash()
    React.useEffect(() => {
        setBusy(true)
        loadArticleContent(topic)
            .then((article) => {
                refArticle.current = article
                setContent(
                    <Markdown
                        options={{
                            forceBlock: true,
                        }}
                    >
                        {article.content}
                    </Markdown>
                )
            })
            .catch(console.error)
    }, [topic])
    React.useEffect(() => {
        const container = refContainer.current
        if (!container) return

        process(container, refArticle.current, props.widgets)
        setBusy(false)
    }, [content, refContainer.current])
    return (
        <div className={getClassNames(props, busy)} ref={refContainer}>
            {content}
        </div>
    )
}

function getClassNames(props: ArticleViewProps, busy: boolean): string {
    const classNames = ["custom", "view-ArticleView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (busy) classNames.push("busy")

    return classNames.join(" ")
}
