const FS = require("fs")

const content = FS.readFileSync("/usr/share/X11/locale/en_US.UTF-8/Compose", {
    flag: "r",
    encoding: "utf-8",
}).toString()
const lines = content.split("\n")

// Skip header
while (true) {
    const line = lines.shift()
    if (line === "#") break
}

const groups = {}
let group = {}
for (const line of lines) {
    if (line.startsWith("#")) {
        group = {}
        groups[line.substring(2)] = group
        continue
    }

    if (!line.startsWith("<Multi_key>")) continue

    const colonIndex = line.indexOf(":")
    const tabIndex = line.lastIndexOf("\t")
    const hashIndex = line.lastIndexOf("#")
    const keys = line.substring("<Multi_key>".length, colonIndex).trim()
    const valueWithQuotes = line.substring(colonIndex + 1, tabIndex).trim()
    const description = line.substring(hashIndex + 1).trim()
    const value = valueWithQuotes.substring(1, valueWithQuotes.length - 1)
    if (!group[value]) group[value] = []
    group[value].push([keys, description])
}

const toDelete = []
for (const key of Object.keys(groups)) {
    const group = groups[key]
    if (Object.keys(group).length === 0) toDelete.push(key)
}

for (const key of toDelete) {
    delete groups[key]
}

console.log(JSON.stringify(groups))
