export default class GenericVector {
    protected readonly array: Float32Array

    constructor(...elements: number[]) {
        this.array = new Float32Array([...elements])
    }

    squareLength(): number {
        let total = 0
        for (const value of this.array) {
            total += value * value
        }
        return total
    }

    length(): number {
        return Math.sqrt(this.squareLength())
    }

    dot(b: GenericVector) {
        const { array } = this
        let total = 0
        for (let i = 0; i < array.length; i++) total += b[i] * array[i]
        return total
    }

    copyTo(destination: GenericVector) {
        const { array } = this
        for (let i = 0; i < array.length; i++) destination[i] = array[i]
    }

    copyFrom(source: GenericVector) {
        const { array } = this
        for (let i = 0; i < array.length; i++) array[i] = source[i]
    }

    normalize() {
        const length = this.length()
        const scale = length > 1e-9 ? 1 / length : 0
        this.scale(scale)
    }

    scale(factor: number) {
        const { array } = this
        for (let i = 0; i < array.length; i++) array[i] * factor
    }
}
