alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

grid = [[]] * 4

swaps = [
    "ABDC",
    "ACBD",
    "ADBC",
    "ACDB",
    "ADCB",
    "BACD",
    "BADC",
    "CABD",
    "DABC",
    "CADB",
    "DACB",
    "BCAD",
    "BDAC",
    "CBAD",
    "DBAC",
    "CDAB",
    "DCAB",
    "BCDA",
    "BDCA",
    "CBDA",
    "DBCA",
    "CDBA",
    "DCBA",
]


def grid2str(g):
    lines = []
    for row in range(len(g)):
        txt = alphabet[row]
        line = g[row]
        for col in line:
            txt = txt + alphabet[col]
        lines.append(txt)
    return ",".join(lines)


def has(i, g):
    count = 0
    for line in g:
        if i in line:
            count = count + 1
    return count >= 2


def findBestName(name):
    best = name
    bestSwap = "ABCD"
    items = name.split(",")
    A = ord("A")
    for swap in swaps:
        candidate = []
        for item in items:
            letters = []
            for c in item[1:]:
                index = ord(c) - A
                letters.append(swap[index])
            letters.sort()
            c = item[0]
            index = ord(c) - A
            candidate.append(swap[index] + "".join(letters))
        candidate.sort()
        candidateName = ",".join(candidate)
        if candidateName < best:
            best = candidateName
            bestSwap = swap
    return (best, bestSwap)


def swapName(name, swap):
    items = name.split(",")
    A = ord("A")
    candidate = []
    for item in items:
        letters = []
        for c in item:
            index = ord(c) - A
            letters.append(swap[index])
        candidate.append("".join(letters))
    return ",".join(candidate)


def find(g, size):
    if len(g) == size:
        name = grid2str(g)
        (bestName, bestSwap) = findBestName(name)
        print(f'@grid"{name}"')
        if bestSwap != "ABCD":
            print(f' @grid{{grid:"{name}",label:"{name}"}}')
            swappedName = swapName(name, bestSwap).lower()
            print(f'  @grid{{grid:"{swappedName}",label:"{swappedName}"}}')
            parts = swappedName.split(",")
            parts.sort()
            newName = ",".join(parts)
            print(f'  @grid{{grid:"{newName}",label:"{newName}"}}')
        return

    row = len(g)
    for a in range(0, size - 1):
        if a == row or has(a, g):
            continue
        for b in range(a + 1, size):
            if b == row or has(b, g):
                continue
            g.append([a, b])
            find(g, size)
            g.pop()


find([], 4)
