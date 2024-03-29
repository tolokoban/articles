export type TokenName = "SPACE" | "NUMBER" | "NAME" | "STRING" | "OPEN_PAR" | "CLOSE_PAR" | "OPEN_BRA" | "CLOSE_BRA" | "OPEN_CUR" | "CLOSE_CUR" | "COLOR" | "PIPE" | "TILDA" | "DIVIDE" | "AT" | "DEG" | "PERCENT" | "DOLLAR" | "SEMICOLON" | "END";
export interface Token {
    name: TokenName;
    value: string;
    pos: number;
}
export declare function getTokensList(content: string): Token[];
//# sourceMappingURL=lexer.d.ts.map