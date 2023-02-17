import { Token, TokenName } from "./lexer"

export interface Point {
    name: string
    x: number
    y: number
    visible: boolean
}

interface StylesShape {
    stroke: string
    fill: string
    thickness: number
}

export interface Polyline extends StylesShape {
    type: "polyline"
    start: [x: number, y: number]
    points: Array<[x: number, y: number]>
}

export interface Circle extends StylesShape {
    type: "circle"
    center: [x: number, y: number]
    radiusX: number
    radiusY: number
    start: number
    end: number
}

export interface BezierQuadratic extends StylesShape {
    type: "bezier-quadratic"
    start: [x: number, y: number]
    points: Array<[x: number, y: number]>
}

export interface BezierCubic extends StylesShape {
    type: "bezier-cubic"
    start: [x: number, y: number]
    points: Array<[x: number, y: number]>
}

export type Shape = Polyline | Circle | BezierCubic | BezierQuadratic

const COLORS = {
    "0": "none",
    "1": "#000",
    "2": "#06f",
    "3": "#ffa500",
    "4": "#888",
    "5": "#8aafff",
    "6": "#ffd380",
    "7": "#0005",
    "8": "#06f5",
    "9": "#ffa50055",
    R: "#f00",
    G: "#0f0",
    B: "#00f",
    r: "#f007",
    g: "#0f07",
    b: "#00f7",
    W: "#fff",
    w: "#fff7",
}

export default class Scanner {
    public readonly shapes: Shape[] = []
    private readonly pointsMap: { [key: string]: Point } = {}
    private tokenIndex = 0
    private stroke = COLORS["1"]
    private fill = COLORS["1"]
    private thickness = 1
    private pseudoPointCounter = 0

    constructor(
        private readonly code: string,
        private readonly tokens: Token[]
    ) {
        const parsers: Array<(token: Token) => boolean> = [
            this.parseLine,
            this.parsePlot,
            this.parsePoly,
            this.parsePointDef,
            this.parseColor,
            this.parseCircle,
            this.parseBezier,
            this.parseThickness,
        ]
        while (true) {
            const token = this.next()
            if (token.name === "END") break

            let found = false
            for (const parser of parsers) {
                if (parser(token)) {
                    found = true
                    break
                }
            }
            if (!found) {
                console.error("code:", code)
                console.error("token:", token)
                console.error("tokens:", this.tokens)
                throw Error(
                    this.error(
                        token.pos,
                        `Code non reconnu ! Debut d'instruction attendue.`
                    )
                )
            }
        }
    }

    public get points() {
        return Object.values(this.pointsMap)
    }

    private get style(): StylesShape {
        return {
            fill: this.fill,
            stroke: this.stroke,
            thickness: this.thickness,
        }
    }

    private error(pos: number, message: string) {
        const lines = this.code.split("\n")
        const output: string[] = []
        let index = 0
        let cursor = pos
        for (const line of lines) {
            const size = line.length + 1
            index += size
            output.push(line)
            if (index >= pos) break

            cursor -= size
        }
        return `${output.join("\n")}\n${spc(cursor)}^\n${message}`
    }

    private getPoint(name: string): Point {
        const point = this.pointsMap[name]
        if (!point) throw Error(`Le point "${name}" n'a pas été défini !`)

        return point
    }

    private readonly parsePointDef = (token: Token): boolean => {
        if (token.name !== "NAME") return false

        const name = token.value
        try {
            const tknOpen = this.next("OPEN_PAR", "OPEN_BRA")
            switch (tknOpen.name) {
                case "OPEN_PAR":
                    const tkn = this.next("NUMBER", "NAME")
                    if (tkn.name === "NUMBER") {
                        const tknX = tkn
                        const tknY = this.next("NUMBER")
                        this.next("CLOSE_PAR")
                        this.pointsMap[name] = {
                            name,
                            x: parseFloat(tknX.value),
                            y: parseFloat(tknY.value),
                            visible: false,
                        }
                        return true
                    }
                    const point = this.getPoint(tkn.value)
                    const rx = parseFloat(this.next("NUMBER").value)
                    let ry = 0
                    this.test(() => {
                        this.next("DIVIDE")
                        ry = parseFloat(this.next("NUMBER").value)
                    })
                    if (ry <= 0) ry = rx
                    this.next("DEG")
                    const ang =
                        (Math.PI * parseFloat(this.next("NUMBER").value)) / 180
                    this.pointsMap[name] = {
                        name,
                        visible: false,
                        x: point.x + rx * Math.cos(ang),
                        y: point.y + ry * Math.sin(ang),
                    }
                    console.log("🚀 [scanner] rx, ry, ang = ", rx, ry, ang) // @FIXME: Remove this line written on 2023-02-13 at 16:13
                    console.log(
                        "🚀 [scanner] this.pointsMap = ",
                        this.pointsMap
                    ) // @FIXME: Remove this line written on 2023-02-13 at 16:12
                    this.next("CLOSE_PAR")
                    return true
                case "OPEN_BRA":
                    /**
                     * Barycenter
                     */
                    let count = 0
                    let x = 0
                    let y = 0
                    let weight = 1
                    while (true) {
                        const tkn = this.next("NAME", "NUMBER", "CLOSE_BRA")
                        if (tkn.name === "CLOSE_BRA") break

                        if (tkn.name === "NUMBER") {
                            weight = parseFloat(tkn.value)
                            continue
                        }
                        const point = this.getPoint(tkn.value)
                        count += weight
                        x += point.x * weight
                        y += point.y * weight
                        weight = 1
                    }
                    if (count === 0)
                        throw Error("Mauvaise syntaxe pour le barycentre !")
                    this.pointsMap[name] = {
                        name,
                        x: x / count,
                        y: y / count,
                        visible: false,
                    }
                    return true
            }
            return false
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le point "${name}" !\n${ex}`
                )
            )
        }
    }

    private readonly parsePoly = (token: Token): boolean => {
        if (token.name !== "OPEN_BRA") return false

        try {
            const poly: Polyline = {
                type: "polyline",
                points: [],
                start: [0, 0],
                ...this.style,
            }
            let first = true
            while (true) {
                const tkn = this.next("NAME", "CLOSE_BRA")
                if (tkn.name === "CLOSE_BRA") break

                const { x, y } = this.getPoint(tkn.value)
                if (first) {
                    first = false
                    poly.start = [x, y]
                } else {
                    poly.points.push([x, y])
                }
            }
            this.shapes.push(poly)
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le polygone !\n${ex}`
                )
            )
        }
    }

    private readonly parseBezier = (token: Token): boolean => {
        if (token.name !== "TILDA") return false

        const tknOpen = this.next("OPEN_PAR", "OPEN_BRA")
        try {
            if (tknOpen.name === "OPEN_PAR") {
                const poly: BezierCubic = {
                    type: "bezier-cubic",
                    start: [0, 0],
                    points: [],
                    ...this.style,
                }
                let first = true
                while (true) {
                    const tkn = this.next("NAME", "CLOSE_PAR")
                    if (tkn.name === "CLOSE_PAR") break

                    const { x, y } = this.getPoint(tkn.value)
                    if (first) {
                        first = false
                        poly.start = [x, y]
                    } else {
                        poly.points.push([x, y])
                    }
                }
                this.shapes.push(poly)
                return true
            } else {
                const poly: BezierQuadratic = {
                    type: "bezier-quadratic",
                    start: [0, 0],
                    points: [],
                    ...this.style,
                }
                let first = true
                while (true) {
                    const tkn = this.next("NAME", "CLOSE_BRA")
                    if (tkn.name === "CLOSE_BRA") break

                    const { x, y } = this.getPoint(tkn.value)
                    if (first) {
                        first = false
                        poly.start = [x, y]
                    } else {
                        poly.points.push([x, y])
                    }
                }
                this.shapes.push(poly)
                return true
            }
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour la courbe de Bézier !\n${ex}`
                )
            )
        }
    }

    private readonly parseLine = (token: Token): boolean => {
        if (token.name !== "OPEN_PAR") return false

        try {
            const poly: Polyline = {
                type: "polyline",
                points: [],
                start: [0, 0],
                ...this.style,
            }
            const A = this.getPoint(this.next("NAME").value)
            const tkn = this.next("NAME", "PIPE")
            const median = tkn.name === "PIPE"
            const B = this.getPoint(
                median ? this.next("NAME").value : tkn.value
            )
            this.next("CLOSE_PAR")
            if (median) {
                const vx = B.y - A.y
                const vy = A.x - B.x
                const x = (A.x + B.x) / 2
                const y = (A.y + B.y) / 2
                poly.start = [x - vx * 1e5, y - vy * 1e5]
                poly.points = [[x + vx * 1e5, y + vy * 1e5]]
            } else {
                const vx = B.x - A.x
                const vy = B.y - A.y
                poly.start = [A.x - vx * 1e5, A.y - vy * 1e5]
                poly.points = [[A.x + vx * 1e5, A.y + vy * 1e5]]
            }
            this.shapes.push(poly)
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le polygone !\n${ex}`
                )
            )
        }
    }

    private readonly parsePlot = (token: Token): boolean => {
        if (token.name !== "OPEN_CUR") return false

        try {
            while (true) {
                const tkn = this.next("NAME", "CLOSE_CUR")
                if (tkn.name === "CLOSE_CUR") break

                const point = this.getPoint(tkn.value)
                point.visible = true
            }
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour les points à afficher !\n${ex}`
                )
            )
        }
    }

    private readonly parseCircle = (token: Token): boolean => {
        if (token.name !== "AT") return false

        try {
            const circle: Circle = {
                type: "circle",
                center: [0, 0],
                radiusX: 1,
                radiusY: 0,
                start: 0,
                end: 360,
                ...this.style,
            }
            const center = this.getPoint(this.next("NAME").value)
            circle.center = [center.x, center.y]
            if (
                !this.test(() => {
                    const passBy = this.getPoint(this.next("NAME").value)
                    const x = passBy.x - center.x
                    const y = passBy.y - center.y
                    circle.radiusX = Math.sqrt(x * x + y * y)
                })
            ) {
                circle.radiusX = parseFloat(this.next("NUMBER").value)
                this.test(() => {
                    this.next("DIVIDE")
                    circle.radiusY = parseFloat(this.next("NUMBER").value)
                })
            }
            this.test(() => {
                this.next("SEMICOLON")
                const startDeg = parseFloat(this.next("NUMBER").value)
                circle.start = (Math.PI * startDeg) / 180
                const endDeg = parseFloat(this.next("NUMBER").value)
                circle.end = (Math.PI * endDeg) / 180
            })
            if (circle.radiusY <= 0) circle.radiusY = circle.radiusX
            this.shapes.push(circle)
            /**
             * We add pseudo points to make space around the center of this circle.
             * If we don't, the scaling could put the circle outside the viewport.
             */
            const [cx, cy] = circle.center
            this.pointsMap[`pseudo-${this.pseudoPointCounter++}`] = {
                name: "",
                visible: false,
                x: cx + circle.radiusX,
                y: cy,
            }
            this.pointsMap[`pseudo-${this.pseudoPointCounter++}`] = {
                name: "",
                visible: false,
                x: cx - circle.radiusX,
                y: cy,
            }
            this.pointsMap[`pseudo-${this.pseudoPointCounter++}`] = {
                name: "",
                visible: false,
                x: cx,
                y: cy + circle.radiusY,
            }
            this.pointsMap[`pseudo-${this.pseudoPointCounter++}`] = {
                name: "",
                visible: false,
                x: cx,
                y: cy - circle.radiusY,
            }
            return true
        } catch (ex) {
            throw Error(
                this.error(
                    token.pos,
                    `Définition erronée pour le polygone !\n${ex}`
                )
            )
        }
    }

    private readonly parseColor = (token: Token): boolean => {
        if (token.name !== "COLOR") return false

        const tail = token.value.substring(1).trim()
        const stroke = (tail.charAt(0) ?? "0") as keyof typeof COLORS
        const fill = (tail.charAt(1) ?? "0") as keyof typeof COLORS
        this.stroke = COLORS[stroke] ?? "none"
        this.fill = COLORS[fill] ?? "none"
        return true
    }

    private readonly parseThickness = (token: Token): boolean => {
        if (token.name !== "PERCENT") return false

        this.thickness = parseFloat(this.next("NUMBER").value)
        return true
    }

    /**
     * Test a bunch of actions and return `true` if no exception has
     * been raised.
     * Otherwise, return `false` and rollback the cursor.
     */
    private test(...actions: Array<() => void>): boolean {
        const savedTokenIndex = this.tokenIndex
        for (const action of actions) {
            try {
                action()
                return true
            } catch (ex) {
                this.tokenIndex = savedTokenIndex
            }
        }
        this.tokenIndex = savedTokenIndex
        return false
    }

    private next(...expected: TokenName[]): Token {
        const token = this.tokens[this.tokenIndex++]
        if (expected.length === 0) return token ?? { name: "END", value: "" }

        if (!token || !expected.includes(token.name))
            throw Error(
                `Attendu ${expected
                    .map((tkn) => `"${tkn}"`)
                    .join(" ou ")} mais reçu "${token?.name}" !`
            )
        return token
    }

    private skip(...expected: TokenName[]): boolean {
        try {
            this.next(...expected)
            return true
        } catch (ex) {
            return false
        }
    }

    private back(steps = 1) {
        this.tokenIndex = Math.max(0, this.tokenIndex - steps)
    }
}

function spc(index: number) {
    let text = ""
    while (index-- > 0) text += " "
    return text
}
