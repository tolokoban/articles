import JSON5 from "json5"
import { ArticleContent } from "./types"
import { isObject } from "../../tool/validator"
import { loadTextFromURL } from "../../tool/load-text"
import { findEndOfObject } from "./find-end-of-object"

const DEFAULT_LANG = "fr"

const cache = new Map<string, ArticleContent>()

export async function loadArticleContent(
    topic: string,
    lang = DEFAULT_LANG
): Promise<ArticleContent> {
    const key = `${lang}/${topic}`
    let article: ArticleContent | undefined = cache.get(key)
    if (article) return article

    article = await loadArticleContentFromNetwork(topic, lang)
    cache.set(key, article)
    return article
}

async function loadArticleContentFromNetwork(
    topic: string,
    lang = DEFAULT_LANG
): Promise<ArticleContent> {
    let article: ArticleContent | undefined = undefined
    article = await tryToLoad(topic, lang)
    if (article) return article
    if (lang !== DEFAULT_LANG) {
        article = await tryToLoad(topic, DEFAULT_LANG)
        if (article) return article
    }
    console.warn(`Can't find topic "${topic}"!`)
    article = await tryToLoad("@", lang)
    if (article) return article
    if (lang !== DEFAULT_LANG) {
        article = await tryToLoad("@", DEFAULT_LANG)
        if (article) return article
    }
    throw Error(
        `Cannot find article "${article}" and there is no fallback "@"!`
    )
}

/**
 * @returns `null` if the topic has not been found.
 * @param topic If `topic` has a trailing "slash", we will look for the url:
 * `articles/<lang>/<root>/<tail>/<tail>.md`.
 * @param lang
 */
async function tryToLoad(
    topic: string,
    lang: string
): Promise<ArticleContent | undefined> {
    const parts = expandTopic(topic)
    const tail = parts.length > 0 ? parts.pop() ?? "@" : "@"
    const root = parts.join("/")
    const url =
        root.length > 0
            ? `articles/${lang}/${root}/${tail}.md`
            : `articles/${lang}/${tail}.md`
    try {
        const content = await loadTextFromURL(url)
        if (!content) return

        return {
            content: parseWidgets(content),
            topic: tail,
            base: `articles/${lang}/${root}/`,
            lang,
        }
    } catch (ex) {
        return
    }
}

function parseWidgets(content: string): string {
    const block = parseBlockWidget(content)
    return parseInlineWidget(block)
}

interface Section {
    start: number
    end: number
    name: string
    value: Record<string, unknown>
}

const RX_INLINE_WIDGET = /@([A-Z][A-Z0-9-]*)[\{"'\[]/gi

/**
 * Inline widgets start with a "@" immediatly followed by the widget
 * name, immediatly followed by a "{".
 */
function parseInlineWidget(content: string): string {
    const sections: Section[] = []
    RX_INLINE_WIDGET.lastIndex = -1
    while (true) {
        const match = RX_INLINE_WIDGET.exec(content)
        if (!match) break

        const [all, name] = match
        const start = RX_INLINE_WIDGET.lastIndex - all.length
        const end = findEndOfObject(content, RX_INLINE_WIDGET.lastIndex - 1)
        const paramsString = content.substring(start + name.length + 1, end)
        console.log("🚀 [loader] paramsString = ", paramsString) // @FIXME: Remove this line written on 2023-01-23 at 16:27
        const value = parseJSON5(paramsString)
        console.log("🚀 [loader] value = ", value) // @FIXME: Remove this line written on 2023-01-23 at 16:17
        const section: Section = {
            start,
            end,
            name,
            value,
        }
        sections.push(section)
        RX_INLINE_WIDGET.lastIndex = end
    }
    const parts: string[] = []
    let index = 0
    for (const { start, end, name, value } of sections) {
        if (value instanceof Error) {
            parts.push(
                `${content.substring(
                    index,
                    start
                )}<div class="error">Unable to parse value of widget <b>${name}</b>: <code style="white-space:pre-wrap">${
                    value.message
                }</code></div>`
            )
        } else {
            parts.push(
                `${content.substring(
                    index,
                    start
                )}<span data-widget="${name}">${btoa(
                    JSON5.stringify(value)
                )}</span>`
            )
        }
        index = end
    }
    return parts.join("") + content.substring(index)
}

const RX_BLOCK_WIDGET = /^```([a-z][a-z0-9-]*)(\{.*\})?$/gi

/**
 * Block widgets are surrounded by triple back ticks.
 * They will be replaced by a `<span>` element with a
 * `data-widget` attribute holding ne name of the widget.
 * The span's content will be a Base64 stringyfication
 * of the params.
 */
function parseBlockWidget(content: string): string {
    const lines: string[] = []
    let inCode = false
    let name = ""
    let code = ""
    let attribs: Record<string, unknown> = {}
    for (const line of content.split("\n")) {
        if (inCode) {
            if (line.startsWith("```")) {
                lines.push(
                    `<span data-widget="${name}">${btoa(
                        JSON5.stringify({
                            ...attribs,
                            value: code.trim(),
                        })
                    )}</span>`
                )
                inCode = false
            } else {
                code += `${line}\n`
            }
        } else {
            RX_BLOCK_WIDGET.lastIndex = -1
            const match = RX_BLOCK_WIDGET.exec(line)
            if (!match) {
                lines.push(line)
            } else {
                name = match[1]
                attribs = parseAtribs(match[2])
                inCode = true
                code = ""
            }
        }
    }
    return lines.join("\n")
}

function parseJSON5(text: string) {
    try {
        return JSON5.parse(text)
    } catch (ex) {
        console.error("Unable to parse JSON5:", text)
        console.error(ex)
        return new Error(text)
    }
}

function parseAtribs(text?: string): Record<string, unknown> {
    if (!text) return {}

    try {
        const data = JSON5.parse(text)
        if (!isObject(data))
            throw Error(`Object expected but got "${typeof data}"!`)
        return data
    } catch (ex) {
        console.error("Unable to parse JSON5:", text)
        console.error(ex)
        return {}
    }
}

/**
 * If `path` ends with `/`, we add the last part of the path.
 * @returns Examples:
 * ```
 * expandTopic("hello/world") === ["hello", "world"]
 * expandTopic("hello/world/") === ["hello", "world", "world"]
 * ```
 */
function expandTopic(path: string): string[] {
    const parts = path
        .split("/")
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
    const last = parts[parts.length - 1] ?? ""
    if (path.trim().endsWith("/")) {
        parts.push(last)
    }
    return parts
}
