/// <reference types="react" />
import "./black-board-view.css";
export interface BlackBoardViewProps {
    className?: string;
    children: string | string[];
    align?: string;
    onError?(error: string): void;
}
export default function BlackBoardView(props: BlackBoardViewProps): JSX.Element;
//# sourceMappingURL=black-board-view.d.ts.map