import { Token } from "./lexer";
export interface Point {
    name: string;
    x: number;
    y: number;
    visible: boolean;
}
interface StylesShape {
    stroke: string;
    fill: string;
    thickness: number;
}
export interface Polyline extends StylesShape {
    type: "polyline";
    start: [x: number, y: number];
    points: Array<[x: number, y: number]>;
}
export interface Circle extends StylesShape {
    type: "circle";
    center: [x: number, y: number];
    radius: number;
}
export interface BezierQuadratic extends StylesShape {
    type: "bezier-quadratic";
    start: [x: number, y: number];
    points: Array<[x: number, y: number]>;
}
export interface BezierCubic extends StylesShape {
    type: "bezier-cubic";
    start: [x: number, y: number];
    points: Array<[x: number, y: number]>;
}
export type Shape = Polyline | Circle | BezierCubic | BezierQuadratic;
export default class Scanner {
    private readonly code;
    private readonly tokens;
    readonly shapes: Shape[];
    private readonly pointsMap;
    private tokenIndex;
    private stroke;
    private fill;
    private thickness;
    constructor(code: string, tokens: Token[]);
    get points(): Point[];
    private get style();
    private error;
    private getPoint;
    private readonly parsePointDef;
    private readonly parsePoly;
    private readonly parseBezier;
    private readonly parseLine;
    private readonly parsePlot;
    private readonly parseCircle;
    private readonly parseColor;
    private readonly parseThickness;
    private test;
    private next;
    private back;
}
export {};
//# sourceMappingURL=scanner.d.ts.map