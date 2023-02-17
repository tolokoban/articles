export function clamp(value: number, min: number, max: number) {
    if (value < min) return min
    if (value > max) return max
    return value
}

const RADIANS_PER_DEGREE = Math.PI / 180

export function radians(degrees: number): number {
    return degrees * RADIANS_PER_DEGREE
}

const DEGREES_PER_RADIAN = 180 / Math.PI

export function degrees(radians: number): number {
    return radians * DEGREES_PER_RADIAN
}
