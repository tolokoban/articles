export async function loadTextFromURL(url: string): Promise<string | null> {
    try {
        const response: Response = await fetch(url)
        if (!response.ok) return null
        return await response.text()
    } catch (ex) {
        return null
    }
}
