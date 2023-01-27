/// <reference types="react" />
import { WidgetMaker } from "./types";
import "./article-view.css";
export interface ArticleViewProps {
    className?: string;
    widgets: {
        [key: string]: Promise<{
            default: WidgetMaker;
        }>;
    };
}
export default function ArticleView(props: ArticleViewProps): JSX.Element;
//# sourceMappingURL=article-view.d.ts.map