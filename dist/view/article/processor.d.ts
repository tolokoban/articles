import { ArticleContent, WidgetMaker } from "./types";
export declare function process(div: HTMLDivElement, article: ArticleContent, widgets: {
    [key: string]: Promise<{
        default: WidgetMaker;
    }>;
}): void;
//# sourceMappingURL=processor.d.ts.map