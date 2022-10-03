import JSON5 from "json5"
import { ArticleContent } from "./types"
import { isObject } from "../../tool/validator"
import { loadTextFromURL } from "../../tool/load-text"

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
 * @param topic If `topic` has no "slash", we will look for the url:
 * `articles/<lang>/<topic>/<topic>.md`.
 * @param lang
 */
async function tryToLoad(
    topic: string,
    lang: string
): Promise<ArticleContent | undefined> {
    const [root, ...rest] = topic.split("/")
    const tail = rest.length > 0 ? rest.join("/") : root
    const url = `articles/${lang}/${root}/${tail}.md`
    const lastSlash = url.lastIndexOf("/")
    const base = url.substring(0, lastSlash + 1)
    try {
        const content = await loadTextFromURL(url)
        if (!content) return

        return {
            content: parseWidgets(content),
            topic: root,
            base,
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

function parseInlineWidget(content: string): string {
    const sections: Section[] = []
    const RX = /@([A-Z][A-Z0-9-]*)\{/gi
    while (true) {
        const match = RX.exec(content)
        if (!match) break

        const [all, name] = match
        const start = RX.lastIndex - all.length
        const end = findEndOfObject(content, RX.lastIndex)
        const value = parseJSON5(
            content.substring(start + name.length + 1, end)
        )
        const section: Section = {
            start,
            end,
            name,
            value,
        }
        sections.push(section)
        RX.lastIndex = end
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

const RX_BLOCK_WIDGET = /^```([a-z][a-z0-9-]*)([^a-z0-9-].*)?$/gi

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

function findEndOfObject(content: string, lastIndex: number) {
    let depth = 0
    let mode:
        | "default"
        | "single-quote"
        | "double-quote"
        | "single-quote-escape"
        | "double-quote-escape" = "default"
    for (let i = lastIndex; i < content.length; i++) {
        const c = content.charAt(i)
        switch (mode) {
            case "single-quote":
                if (c === "'") mode = "default"
                else if (c === "\\") mode = "single-quote-escape"
                break
            case "single-quote-escape":
                mode = "default"
                break
            case "double-quote":
                if (c === '"') mode = "default"
                else if (c === "\\") mode = "double-quote-escape"
                break
            case "double-quote-escape":
                mode = "default"
                break
            default:
                switch (c) {
                    case "'":
                        mode = "single-quote"
                        break
                    case '"':
                        mode = "double-quote"
                        break
                    case "{":
                        depth++
                        break
                    case "}":
                        if (depth === 0) return i + 1
                        depth--
                        break
                }
        }
    }
    return content.length - 1
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

function parseAtribs(text: string): Record<string, unknown> {
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
