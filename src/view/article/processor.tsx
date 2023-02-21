import BlackBoardView from "@/view/black-board/black-board-view"
import CodeView from "@/view/code"
import JSON5 from "json5"
import { ArticleContent, WidgetMaker } from "./types"
import { createRoot } from "react-dom/client"
import { isObject, isString } from "../../tool/validator"
import { loadTextFromURL } from "../../tool/load-text"

const DEFAULT_WIDGET_MAKER = new Promise<{ default: WidgetMaker }>(
    (resolve) => {
        resolve({
            default: new WidgetMaker(),
        })
    }
)

export function process(
    div: HTMLDivElement,
    article: ArticleContent,
    widgets: { [key: string]: Promise<{ default: WidgetMaker }> }
) {
    processLocalLinks(div, article)
    processLocalImages(div, article)
    const widgetMaker: Promise<{ default: WidgetMaker }> | undefined =
        getWidget(widgets, article)
    console.log("🚀 [processor] widgetMaker = ", widgetMaker) // @FIXME: Remove this line written on 2023-02-20 at 17:58
    processWidgets(div, article, widgetMaker)
}

function processWidgets(
    div: HTMLDivElement,
    article: ArticleContent,
    widgetMaker: Promise<{ default: WidgetMaker }> = DEFAULT_WIDGET_MAKER
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
                            align={
                                isString(value.align) ? value.align : undefined
                            }
                            label={value.label as string | undefined}
                        />
                    )
                }
                break
            case "code":
                if (!isObject(value)) break
                if (!isString(value.src)) break
                console.log("🚀 [processor] article, value = ", article, value) // @FIXME: Remove this line written on 2023-01-23 at 15:06
                const src = `${article.base}/${value.src}`
                const extension = src.split(".").pop() ?? "text"
                loadTextFromURL(src)
                    .then((code) => {
                        console.log("🚀 [processor] code = ", code) // @FIXME: Remove this line written on 2023-01-23 at 15:04
                        if (!code) return

                        widget.removeAttribute("data-widget")
                        createRoot(widget).render(
                            <CodeView lang={extension} value={code} />
                        )
                    })
                    .catch((ex) => {
                        console.error(`Unable to load code at "${src}"!`, ex)
                    })
                break
            case "g":
                if (isObject(value) && isString(value.value)) {
                    widget.removeAttribute("data-widget")
                    createRoot(widget).render(
                        <BlackBoardView
                            children={value.value}
                            align={
                                isString(value.align) ? value.align : undefined
                            }
                        />
                    )
                }
                break
            default:
                delayedWidgets.push([widget, name, value])
        }
    }
    widgetMaker.then(({ default: maker }) => {
        for (const [container, name, data] of delayedWidgets) {
            container.removeAttribute("data-widget")
            createRoot(container).render(maker.make(name, data))
        }
    })
}

function processLocalLinks(div: HTMLDivElement, article: ArticleContent) {
    const links = div.querySelectorAll("a[href]")
    for (const link of links) {
        const href = link.getAttribute("href")
        if (typeof href !== "string") continue

        if (!href.endsWith(".md")) continue

        link.setAttribute(
            "href",
            `#${join(
                article.base.split("/").slice(2).join("/"),
                href.substring(0, href.length - 3)
            )}`
        )
    }
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

function join(base: string, path: string) {
    const parts = base
        .split("/")
        .filter(
            (item) => typeof item === "string" && item && item.trim().length > 0
        )
    for (const item of path.split("/")) {
        if (typeof item !== "string" || item.trim().length === 0) continue

        if (item === "..") parts.pop()
        else if (item !== ".") {
            parts.push(item)
        }
    }
    return parts.join("/")
}

function getWidget(
    widgets: { [key: string]: Promise<{ default: WidgetMaker }> },
    article: ArticleContent
): Promise<{ default: WidgetMaker }> | undefined {
    const base = widgets[article.base]
    if (base) return base

    const topic = widgets[article.topic]
    if (topic) return topic

    const items = article.base.split("/")
    while (true) {
        const item = items.pop()
        if (!isString(item)) break
        if (!item) continue

        const single = widgets[item]
        if (single) return single
    }
}
