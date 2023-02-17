/// <reference types="react" />
import "./code-view.css";
import "highlight.js/styles/github.css";
export interface CodeViewProps {
    className?: string;
    label?: string;
    align?: string;
    expanded?: boolean;
    region?: string;
    value: string;
    lang: string;
}
export default function CodeView(props: CodeViewProps): JSX.Element;
//# sourceMappingURL=code-view.d.ts.map