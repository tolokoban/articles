import GenericVector from "./generic-vector"

describe("tgd2/calc/generic-vector.ts", () => {
    // @TODO: Implement tests.
    describe("GenericVector.squareLength()", () => {
        const cases: Array<[arr: number[], length2: number]> = [
            [[], 0],
            [[7], 49],
            [[1, 0, 0], 1],
            [[0, 1, 0], 1],
            [[0, 0, 1], 1],
            [[0, 0, 0], 0],
            [[1, 2, -3], 14],
        ]
        for (const [elements, expected] of cases) {
            it(`${JSON.stringify(
                elements
            )}.squareLength should be ${expected}`, () => {
                const vec = new GenericVector(...elements)
                expect(vec.squareLength()).toEqual(expected)
            })
            const expected2 = Math.sqrt(expected)
            it(`${JSON.stringify(
                elements
            )}.length should be ${expected2}`, () => {
                const vec = new GenericVector(...elements)
                expect(vec.length()).toBeCloseTo(expected2)
            })
        }
    })
})
