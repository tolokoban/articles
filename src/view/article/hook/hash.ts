import * as React from "react"

export function useHash(): string {
    const [hash, setHash] = React.useState(window.location.hash.substring(1))
    React.useEffect(() => {
        const handleHashChange = (evt: HashChangeEvent) => {
            setHash(window.location.hash.substring(1))
        }
        window.addEventListener("hashchange", handleHashChange)
        return () => window.removeEventListener("hashchange", handleHashChange)
    }, [])
    return hash
}
