import React from "react"

export default class WidgetMaker {
    make(name: string, data: unknown): React.ReactNode {
        return (
            <div className="error">
                Unknown widget <b>{name}</b>!
            </div>
        )
    }
}
