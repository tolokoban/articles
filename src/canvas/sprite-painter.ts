import { isNumber, isObject } from "@/tool/validator"

export interface Sprite {
    top: number
    left: number
    width: number
    height: number
    // Center X, relative to top left corner.
    x: number
    // Center Y, relative to top left corner.
    y: number
}

export function isSprite(data: unknown): data is Sprite {
    if (!isObject(data)) return false
    const { top, left, width, height, x, y } = data
    return (
        isNumber(top) &&
        isNumber(left) &&
        isNumber(width) &&
        isNumber(height) &&
        isNumber(x) &&
        isNumber(y)
    )
}

export default class SpritePainter {
    constructor(
        private readonly ctx: CanvasRenderingContext2D,
        private readonly atlas: HTMLImageElement,
        private readonly sprites: Sprite[]
    ) {}

    paint(spriteIndex: number, x: number, y: number) {
        const sprite = this.sprites[spriteIndex]
        if (!sprite) return

        this.ctx.drawImage(
            this.atlas,
            sprite.left,
            sprite.top,
            sprite.width,
            sprite.height,
            x - sprite.x,
            y - sprite.y,
            sprite.width,
            sprite.height
        )
    }
}
