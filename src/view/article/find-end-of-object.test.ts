import { findEndOfObject } from "./find-end-of-object"

describe("view/article/find-end-of-object.ts", () => {
    function extract(text: string) {
        const index = findEndOfObject(text, 0)
        return text.substring(0, index)
    }
    describe("findEndOfObject()", () => {
        const cases: Array<[input: string, expected: string]> = [
            ["{a: 27}blabla", "{a: 27}"],
            [`"{a: 27}"blabla`, `"{a: 27}"`],
        ]
        for (const [input, expected] of cases) {
            it(`should find ${expected}`, () => {
                const got = extract(input)
                expect(got).toEqual(expected)
            })
        }
    })
})
