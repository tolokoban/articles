export function findEndOfObject(content: string, lastIndex: number) {
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
                if (c === '"') {
                    if (depth === 0) return i + 1
                    mode = "default"
                } else if (c === "\\") mode = "double-quote-escape"
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
                    case "[":
                        depth++
                        break
                    case "}":
                    case "]":
                        depth--
                        if (depth === 0) return i + 1
                        break
                }
        }
    }
    return content.length - 1
}
