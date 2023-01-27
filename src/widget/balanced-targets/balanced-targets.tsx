import { WidgetMaker } from "@/view/article/types"
import React from "react"
import { isObject, isString } from "../../tool/validator"
import Style from "./balanced-targets.module.css"
import Target1 from "./1.png"
import Target2 from "./2.png"
import Target3 from "./3.png"

class TextWidget extends WidgetMaker {
    make(name: string, data: unknown): React.ReactNode {
        if (name === "grid") {
            if (!isGridData(data)) {
                return (
                    <div className="error">
                        Data must be as in these examples:
                        <ul>
                            <li>
                                <code>@grid"ABC,BDA"</code>
                            </li>
                            <li>
                                <code>
                                    @grid{"{"}grid:"ABC,BDA",label:"Hello"{"}"}
                                </code>
                            </li>
                        </ul>
                    </div>
                )
            }
            return makeGrid(data)
        }
        if (name === "card") {
            if (!isString(data)) {
                return (
                    <div className="error">
                        Data must be a string. As in these examples:
                        <ul>
                            <li>
                                <code>@card"3131"</code>
                            </li>
                            <li>
                                <code>@card"3122"</code>
                            </li>
                        </ul>
                    </div>
                )
            }
            return makeCard(data.split(""))
        }
        if (name === "hide") {
            if (!isString(data)) {
                return (
                    <div className="error">
                        Data must be a string. As in these examples:
                        <ul>
                            <li>
                                <code>@hide"3131"</code>
                            </li>
                            <li>
                                <code>@hide"3122"</code>
                            </li>
                        </ul>
                    </div>
                )
            }
            return makeHide(data.split(""))
        }
        return super.make(name, data)
    }
}

export default new TextWidget()

type GridData = string | { grid: string; label: string }

function isGridData(data: unknown): data is GridData {
    if (isString(data)) return true
    if (!isObject(data)) return false
    const { grid, label } = data
    return isString(grid) && isString(label)
}

function makeGrid(data: GridData): React.ReactNode {
    if (isString(data)) data = { grid: data, label: "" }
    const lines = data.grid.split(",").map((x) => x.trim())
    const letters: string[] = []
    for (const line of lines) {
        letters.push(line.charAt(0))
    }
    const divs: React.ReactNode[] = []
    const side = letters.length + 1
    for (let row = 0; row < side; row++) {
        const rowLetter = letters[row - 1]
        const line =
            lines.find((line) => line.charAt(0) === rowLetter) ?? rowLetter
        for (let col = 0; col < side; col++) {
            const colLetter = letters[col - 1]
            if (col === 0) {
                if (row === 0) {
                    divs.push(<div className="header">⬈</div>)
                    continue
                }
                divs.push(<div className="header">{letters[row - 1]}</div>)
                continue
            } else if (row === 0) {
                divs.push(<div className="header">{letters[col - 1]}</div>)
                continue
            }
            if (rowLetter === colLetter) {
                divs.push(<div className="diag"></div>)
                continue
            }
            divs.push(<div>{line.includes(colLetter) ? "✖" : ""}</div>)
        }
    }
    return (
        <div className={Style.container}>
            <label>{data.label}</label>
            <div
                className={Style.grid}
                style={{
                    gridTemplateColumns: `repeat(${side},1.5em)`,
                    gridTemplateRows: `repeat(${side},1.5em)`,
                }}
            >
                {divs}
            </div>
        </div>
    )
}

function makeCard(letters: string[]) {
    const images = { "1": Target1, "2": Target2, "3": Target3 }
    return (
        <div className={Style.Card}>
            <header>{letters.join(" → ")}</header>
            {letters.map((letter) => (
                <img key={letter} src={images[letter]} width={128} />
            ))}
        </div>
    )
}

function makeHide(letters: string[]) {
    return (
        <div className={Style.Hide}>
            {makeCard(letters)}
            <div className="cache">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="show"></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
