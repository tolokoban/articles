import * as React from "react"
import glsl from "highlight.js/lib/languages/glsl"
import Highlight from "highlight.js/lib/core"
import html from "highlight.js/lib/languages/xml"
import markdown from "highlight.js/lib/languages/markdown"
import typescript from "highlight.js/lib/languages/typescript"
import { copyToClipboard } from "@/tool/copy-to-clipboard"
import "./code-view.css"
import "highlight.js/styles/github.css"

Highlight.registerLanguage("typescript", typescript)
Highlight.registerLanguage("ts", typescript)
Highlight.registerLanguage("tsx", typescript)
Highlight.registerLanguage("glsl", glsl)
Highlight.registerLanguage("vert", glsl)
Highlight.registerLanguage("frag", glsl)
Highlight.registerLanguage("html", html)
Highlight.registerLanguage("markdown", markdown)
Highlight.registerLanguage("md", markdown)

export interface CodeViewProps {
    className?: string
    label?: string
    expanded?: boolean
    /**
     * There are special comments that define regions in the code.
     * You can use `"//#region my-region"` and `"//#endregion my-region"`
     * on a full line to define a region.
     *
     * Such lines will be removed from the displayed code.
     * And it `region` property is defined, only code of such region
     * will be displayed.
     */
    region?: string
    value: string
    lang: string
}

export default function CodeView(props: CodeViewProps) {
    const [expanded, setExpanded] = React.useState(props.expanded ?? true)
    const toggle = () => setExpanded(!expanded)
    const ref = React.useRef<null | HTMLElement>(null)
    React.useEffect(() => {
        if (!ref.current) return

        Highlight.highlightElement(ref.current)
    }, [props.value, ref])
    const code = extractRegion(props.value, props.region)
    return (
        <div className={getClassNames(props, expanded)}>
            <header className="theme-color-primary-dark">
                <svg
                    onClick={toggle}
                    className={expanded ? "rotate" : ""}
                    viewBox="0 0 24 24"
                    preserveAspectRatio="meet xMidYMid"
                >
                    <path
                        fill="currentColor"
                        d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
                    ></path>
                </svg>
                <div className="label" onClick={toggle}>
                    {props.label ?? ""}
                </div>
                <div style={{ width: "1em" }}></div>
                <svg
                    onClick={() => copyToClipboard(code)}
                    viewBox="0 0 24 24"
                    preserveAspectRatio="meet xMidYMid"
                >
                    <path
                        fill="currentColor"
                        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
                    ></path>
                </svg>
            </header>
            <pre>
                <code ref={ref} className={`language-${props.lang}`}>
                    {code}
                </code>
            </pre>
        </div>
    )
}

function getClassNames(props: CodeViewProps, expanded: boolean): string {
    const classNames = ["custom", "view-CodeView", "theme-shadow-button"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (expanded) classNames.push("expanded")

    return classNames.join(" ")
}

const START = "//#region"
const END = "//#endregion"

function extractRegion(value: string, region: string | undefined): string {
    const lines: Array<{
        line: string
        regions: string[]
    }> = []
    let regions: string[] = []
    for (const line of value.split("\n")) {
        if (line.startsWith(START)) {
            const name = line.substring(START.length).trim()
            if (!regions.includes(name)) regions.push(name)
            continue
        }
        if (line.startsWith(END)) {
            const name = line.substring(END.length).trim()
            regions = regions.filter((item) => item != name)
            continue
        }
        lines.push({
            line,
            regions: [...regions],
        })
    }
    if (!region) return lines.map((item) => item.line).join("\n")
    return lines
        .filter((item) => item.regions.includes(region))
        .map((item) => item.line)
        .join("\n")
}
