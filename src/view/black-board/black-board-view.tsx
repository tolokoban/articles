import * as React from "react"
import Scanner, { Point } from "./scanner"
import { getTokensList, Token } from "./lexer"
import "./black-board-view.css"

export interface BlackBoardViewProps {
    className?: string
    children: string | string[]
    align?: string
    onError?(error: string): void
}

export default function BlackBoardView(props: BlackBoardViewProps) {
    const [fullscreen, setFullscreen] = React.useState(false)
    const refCanvas = React.useRef<HTMLCanvasElement | null>(null)
    const [error, setError] = React.useState("")
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        const handler = () =>
            paintCanvas(canvas, sanitizeChildren(props.children), (err) => {
                const log = props.onError ?? console.error
                log(err)
                setError(err)
            })
        handler()
        const watcher = new ResizeObserver(handler)
        watcher.observe(canvas)
        return () => watcher.unobserve(canvas)
    }, [props.children])
    return error ? (
        <pre
            style={{
                backgroundColor: "#b10",
                color: "#eeee",
                whiteSpace: "pre-wrap",
            }}
        >
            {error}
        </pre>
    ) : (
        <canvas
            title="Double-click pour plein écran"
            className={getClassNames(props, fullscreen)}
            ref={refCanvas}
            onDoubleClick={() => setFullscreen(!fullscreen)}
        ></canvas>
    )
}

function getClassNames(
    props: BlackBoardViewProps,
    fullscreen: boolean
): string {
    const classNames = ["custom", "view-BlackBoardView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (fullscreen) classNames.push("fullscreen")
    if (props.align === "left") classNames.push("margin-left")
    else if (props.align === "right") classNames.push("margin-right")

    return classNames.join(" ")
}

function paintCanvas(
    canvas: HTMLCanvasElement,
    content: string,
    setError: React.Dispatch<React.SetStateAction<string>>
) {
    try {
        setError("")
        const tokens = getTokensList(content)
        console.log(content)
        console.log("🚀 [black-board-view] tokens = ", tokens) // @FIXME: Remove this line written on 2023-02-13 at 16:08
        const scanner = new Scanner(content, tokens)
        paint(canvas, scanner)
    } catch (ex) {
        console.error(ex)
        setError(`${ex}`)
    }
}

function paint(canvas: HTMLCanvasElement, scanner: Scanner) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw Error("Impossible de créer un contexte 2D !")

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    console.log("🚀 [black-board-view] scanner = ", scanner) // @FIXME: Remove this line written on 2023-02-13 at 15:27
    const [toX, toY] = makeCoordsMapper(
        canvas.width,
        canvas.height,
        scanner.points
    )
    // Polylines
    for (const shape of scanner.shapes) {
        ctx.strokeStyle = shape.stroke
        ctx.fillStyle = shape.fill
        ctx.lineWidth = shape.thickness
        ctx.beginPath()
        switch (shape.type) {
            case "bezier-cubic":
                const [bcx, bcy] = shape.start
                ctx.moveTo(toX(bcx), toY(bcy))
                for (let i = 0; i < shape.points.length; i += 3) {
                    const [cpx1c, cpy1c] = shape.points[i]
                    const [cpx2c, cpy2c] = shape.points[i + 1]
                    const [xc, yc] = shape.points[i + 2]
                    ctx.bezierCurveTo(
                        toX(cpx1c),
                        toY(cpy1c),
                        toX(cpx2c),
                        toY(cpy2c),
                        toX(xc),
                        toY(yc)
                    )
                }
                break
            case "bezier-quadratic":
                const [bqx, bqy] = shape.start
                ctx.moveTo(toX(bqx), toY(bqy))
                for (let i = 0; i < shape.points.length; i += 2) {
                    const [cpxq, cpyq] = shape.points[i]
                    const [xq, yq] = shape.points[i + 1]
                    ctx.bezierCurveTo(
                        toX(cpxq),
                        toY(cpyq),
                        toX(cpxq),
                        toY(cpyq),
                        toX(xq),
                        toY(yq)
                    )
                }
                break
            case "polyline":
                const [x, y] = shape.start
                ctx.moveTo(toX(x), toY(y))
                for (const [x, y] of shape.points) ctx.lineTo(toX(x), toY(y))
                break
            case "circle":
                const [cx, cy] = shape.center
                const radiusX = toX(cx + shape.radiusX) - toX(cx)
                const radiusY = toX(cx + shape.radiusY) - toX(cx)
                ctx.ellipse(
                    toX(cx),
                    toY(cy),
                    radiusX,
                    radiusY,
                    0,
                    shape.start,
                    shape.end
                )
                break
        }
        if (shape.fill !== "none") ctx.fill()
        if (shape.stroke !== "none") ctx.stroke()
    }
    // Points
    ctx.strokeStyle = "none"
    ctx.fillStyle = "#000"
    const R = 4
    for (const point of scanner.points) {
        if (!point.visible) continue

        ctx.beginPath()
        const x = toX(point.x)
        const y = toY(point.y)
        ctx.arc(x, y, R, 0, 2 * Math.PI)
        ctx.fill()
        ctx.font = "15px sans-serif"
        ctx.fillText(point.name.charAt(0), x + R, y + R + 15)
        ctx.font = "12px sans-serif"
        ctx.fillText(point.name.substring(1), x + R + 10, y + R + 15 + 5)
    }
}

function bounds(points: Point[]) {
    if (points.length < 1) throw Error("Aucun point défini !")

    const [{ x, y }] = points
    let minX = x
    let maxX = x
    let minY = y
    let maxY = y
    for (const { x, y } of points) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
    }
    return { minX, maxX, minY, maxY }
}

function makeCoordsMapper(width: number, height: number, points: Point[]) {
    const MARGIN = 32
    const { minX, maxX, minY, maxY } = bounds(points)
    const x = (maxX + minX) / 2
    const y = (maxY + minY) / 2
    const w = Math.max(1e-6, maxX - minX)
    const h = Math.max(1e-6, maxY - minY)
    const scale = Math.min((width - 2 * MARGIN) / w, (height - 2 * MARGIN) / h)
    return [
        (v: number) => Math.floor(width / 2 + scale * (v - x)) + 0.5,
        (v: number) => Math.floor(height / 2 - scale * (v - y)) + 0.5,
    ]
}

function sanitizeChildren(children: string | string[]): string {
    if (typeof children === "string") return children

    return children.filter((item) => typeof item === "string").join("\n")
}
