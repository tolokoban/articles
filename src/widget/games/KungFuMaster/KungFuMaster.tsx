import { WidgetMaker } from "@/view/article/types"
import React from "react"
import { isArray, isObject } from "@/tool/validator"
import Style from "./KungFuMaster.module.css"
import SpritePainter, { isSprite, Sprite } from "../../../canvas/sprite-painter"
import Atlas from "./sketch-walk.webp"

class KungFuMasterWidget extends WidgetMaker {
    make(name: string, data: unknown): React.ReactNode {
        if (name === "WalkSketch") {
            if (!isSpriteArray(data)) {
                throw Error(`Invalid type for KungFuMaster!`)
            }
            return <WalkSketch data={alternate(data)} />
        }
        return super.make(name, data)
    }
}

export default new KungFuMasterWidget()

function isSpriteArray(data: unknown): data is Sprite[] {
    if (!isArray(data)) return false
    for (const item of data) {
        if (!isSprite(item)) return false
    }
    return true
}

function WalkSketch({ data: sprites }: { data: Sprite[] }) {
    const refCanvas = React.useRef<null | HTMLCanvasElement>(null)
    React.useEffect(() => {
        const canvas = refCanvas.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) throw Error("Unable to get Context 2d!")

        const img = new Image()
        img.src = Atlas
        const painter = new SpritePainter(ctx, img, sprites)
        let spriteIndex = 0
        const id = window.setInterval(() => {
            ctx.clearRect(0, 0, 300, 600)
            painter.paint(spriteIndex, 150, 600)
            spriteIndex = (spriteIndex + 1) % sprites.length
        }, 200)
        return () => {
            window.clearInterval(id)
        }
    }, [refCanvas.current])
    return (
        <canvas
            className={Style.KungFuMaster}
            width={300}
            height={600}
            ref={refCanvas}
        ></canvas>
    )
}

function alternate(data: Sprite[]): Sprite[] {
    const len = data.length
    for (let i = len - 2; i > 0; i--) {
        data.push(data[i])
    }
    return data
}
