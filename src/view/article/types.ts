export interface ArticleContent {
    content: string
    topic: string
    base: string
    lang: string
}

export interface WidgetMaker {
    make(name: string, data: unknown): JSX.Element
}
