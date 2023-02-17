import GenericVector from "./generic-vector"

export class Vec4 extends GenericVector {
    constructor(x: number, y: number, z: number, w: number) {
        super(x, y, z, w)
    }

    get x() {
        return this.array[0]
    }
    set x(value: number) {
        this.array[0] = value
    }

    get y() {
        return this.array[1]
    }
    set y(value: number) {
        this.array[1] = value
    }

    get z() {
        return this.array[2]
    }
    set z(value: number) {
        this.array[2] = value
    }

    get w() {
        return this.array[3]
    }
    set w(value: number) {
        this.array[3] = value
    }

    dot(b: Vec4) {
        return super.dot(b)
    }

    clone(): Vec4 {
        const [x, y, z, w] = this.array
        return new Vec4(x, y, z, w)
    }

    copyTo(destination: Vec4): void {
        super.copyTo(destination)
    }

    copyFrom(source: Vec4): void {
        super.copyFrom(source)
    }
}

export class Vec3 extends GenericVector {
    constructor(x: number, y: number, z: number) {
        super(x, y, z)
    }

    get x() {
        return this.array[0]
    }
    set x(value: number) {
        this.array[0] = value
    }

    get y() {
        return this.array[1]
    }
    set y(value: number) {
        this.array[1] = value
    }

    get z() {
        return this.array[2]
    }
    set z(value: number) {
        this.array[2] = value
    }

    dot(b: Vec3) {
        return super.dot(b)
    }

    clone(): Vec3 {
        const [x, y, z] = this.array
        return new Vec3(x, y, z)
    }

    copyTo(destination: Vec3): void {
        super.copyTo(destination)
    }

    copyFrom(source: Vec3): void {
        super.copyFrom(source)
    }

    cross(b: Vec3): void {
        const [x1, y1, z1] = this.array
        const [x2, y2, z2] = b.array
        this.array[0] = y1 * z2 - y2 * z1
        this.array[1] = x2 * z1 - x1 * z2
        this.array[2] = x1 * y2 - x2 * y1
    }
}

export class Vec2 extends GenericVector {
    constructor(x: number, y: number) {
        super(x, y)
    }

    get x() {
        return this.array[0]
    }
    set x(value: number) {
        this.array[0] = value
    }

    get y() {
        return this.array[1]
    }
    set y(value: number) {
        this.array[1] = value
    }

    dot(b: Vec2) {
        return super.dot(b)
    }

    clone(): Vec2 {
        const [x, y] = this.array
        return new Vec2(x, y)
    }

    copyTo(destination: Vec2): void {
        super.copyTo(destination)
    }

    copyFrom(source: Vec2): void {
        super.copyFrom(source)
    }

    determinant(b: Vec2): number {
        const [x1, y1] = this.array
        const [x2, y2] = b.array
        return x1 * y2 - x2 * y1
    }
}
