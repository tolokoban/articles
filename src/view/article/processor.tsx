import BlackBoardView from "@/view/black-board/black-board-view"
import CodeView from "@/view/code"
import JSON5 from "json5"
import { ArticleContent, WidgetMaker } from "./types"
import { createRoot } from "react-dom/client"
import { isObject, isString } from "../../tool/validator"
import { loadTextFromURL } from "../../tool/load-text"

export function process(
    div: HTMLDivElement,
    article: ArticleContent,
    widgets: { [key: string]: Promise<{ default: WidgetMaker }> }
) {
    processLocalImages(div, article)
    const widgetMaker = widgets[article.topic]
    if (widgetMaker) processWidgets(div, article, widgetMaker)
}

function processWidgets(
    div: HTMLDivElement,
    article: ArticleContent,
    widgetMaker: Promise<{ default: WidgetMaker }>
) {
    const widgets = div.querySelectorAll("span[data-widget]")
    const delayedWidgets: Array<
        [widget: Element, name: string, value: unknown]
    > = []
    for (const widget of widgets) {
        const name = widget.getAttribute("data-widget")
        if (!name) continue

        const value = parseJSON5(atob(widget.textContent ?? ""))
        switch (name) {
            case "text":
            case "raw":
            case "verbatim":
            case "md":
            case "markdown":
            case "ts":
            case "tsx":
            case "glsl":
            case "vert":
            case "frag":
            case "html":
                if (isObject(value) && isString(value.value)) {
                    widget.removeAttribute("data-widget")
                    createRoot(widget).render(
                        <CodeView
                            lang={name}
                            value={value.value}
                            label={value.label as string | undefined}
                        />
                    )
                }
                break
            case "code":
                if (!isObject(value)) break
                if (!isString(value.src)) break
                const src = `${article.base}/${value.src}`
                const extension = src.split(".").pop() ?? "text"
                loadTextFromURL(src)
                    .then((code) => {
                        if (!code) return

                        widget.removeAttribute("data-widget")
                        createRoot(widget).render(
                            <CodeView lang={extension} value={code} />
                        )
                    })
                    .catch(console.error)
                break
            case "g":
                if (isObject(value) && isString(value.value)) {
                    widget.removeAttribute("data-widget")
                    createRoot(widget).render(
                        <BlackBoardView children={value.value} />
                    )
                }
                break
            default:
                delayedWidgets.push([widget, name, value])
        }
    }
    widgetMaker.then(({ default: maker }) => {
        for (const [container, name, data] of delayedWidgets) {
            console.log(">>>", name)
            container.removeAttribute("data-widget")
            createRoot(container).render(maker.make(name, data))
        }
    })
}

function processLocalImages(div: HTMLDivElement, article: ArticleContent) {
    const images = div.querySelectorAll("img")
    for (const image of images) {
        const src = image.getAttribute("src")
        if (!src) continue
        if (src.startsWith("http:") || src.startsWith("https:")) continue
        image.src = `${article.base}${src}`
        if (src.endsWith(".webp")) {
            // We need a fallback for old/poor Safari.
            const picture = document.createElement("picture")
            const source = document.createElement("source")
            source.setAttribute("type", "image/webp")
            source.setAttribute("srcset", image.src)
            const img = document.createElement("img")
            img.setAttribute(
                "src",
                `${image.src.substring(
                    0,
                    image.src.length - ".webp".length
                )}.png`
            )
            picture.appendChild(source)
            picture.appendChild(img)
            image.replaceWith(picture)
        }
    }
}

function parseJSON5(text: string): unknown {
    try {
        return JSON5.parse(text)
    } catch (ex) {
        console.error("Unable to parse JSON5:", text)
        console.error(ex)
        return null
    }
}
