# Comment écrire un article dans ce site

Les articles sont rédigés en [Markdown (GFM)](https://github.github.com/gfm/).
Ceci permet d'assurer un style homogène et de faciliter l'écriture.

Les fichiers des articles sont stoqués dans le répertoire
`public/articles/<lang>/<topic>`. Où `<lang>` est la langue dans laquelle
l'article est écrit.

Le paramètre `<topic>` est déduit du hash de l'URL, comme dans les exemples suivants :

| Hash | Chemin |
| ---- | ------ |
| `#articles` | `articles/articles.md` |
| `#foo/bar` | `foo/bar.md` |
| `#foo/bar/joe` | `foo/bar/joe.md` |

## Images

Les images sont insérées avec cette syntaxe et ne dépassent jamais
la largeur de l'écran :

```md
![Description de l'image](./image.webp)
```

Le format **webp** nétant pas supporté sur tous les navigateurs, c'est l'image
**png** qui sera affichée le cas échéant. Dans l'exemple ci-dessus, cela signifie
qu'il vous faudra fournir un fichier `./image.png`.

## Widgets

### Widgets toujours disponibles

#### Highlight de fichier

Afficher du code à partir d'un fichier présent dans le même répertoire que
l'article :

```md
@code{src:"exemple.ts"}
@code{src:"exemple.ts", label:"Voici un bel exemple"}
```

#### Highlight de code

Colorier du code d'après sa syntaxe. Les syntaxes acceptées sont :

* `md`, `markdown` : markdown GFM
* `text`, `raw` : su texte brut sans formatage
* `ts`, `tsx`, `typescript` : typescript
* `glsl`, `vert`, `frag` : language d'un shader WebGL

#### Dessin géométrique

Le code suivant :

@code{src:"g.md"}

Donne le résultat suivant :

```g
O(0,0)
I(1,0)
J(0,1)
M(-1,2)
#50 %1
(OI)
(OJ)
{OMI}
#39 %2
@ I M
```

### Créer ses propres widgets

Il est possible d'enrichir le Markdown avec tout type de composant.
Pour cela, il faut enregistrer une usine à composant pour un article donné.

Par exemple, pour cet article dont le nom est `#articles`, il faut commencer par
mettre à jour le fichier `src/index.tsx` comme ceci :

```tsx{label: "src/index.tsx"}
function start() {
    const container = document.getElementById("app")
    if (!container) throw Error(`No element with id "app"!`)

    const root = createRoot(container)
    root.render(
        <React.StrictMode>
            <ArticleView
                widgets={{
                    articles: import("./widget/articles"),
                }}
            />
        </React.StrictMode>
    )
}
```

Chaque article ayant besoin de widgets aura une entrée dans l'attribut `widgets` du
composant `<ArticleView />`. L'import se fait en asynchrone pour éviter d'avoir à
attendre pour afficher les pages.

Et voici un exemple d'implémentation du fichier `src/widget/articles/index.tsx` :

```tsx
import { WidgetMaker } from "@/view/article/types"

class TextWidget implements WidgetMaker {
    make(name: string, data: unknown): JSX.Element {
        return (
            <button onClick={() => alert(JSON.stringify(data, null, "  "))}>
                {name}
            </button>
        )
    }
}

export default new TextWidget()
```

### Syntaxes acceptées

Il existe deux syntaxes : block et inline.

Un widget **inline** commence par un arobase ("@") suivi d'un nom (uniquement lettres, tirets et chiffres) et finalement un objet JSON5 délimité par les accolades :

```raw
On a des grilles 4x4 @grid{cols:4, rows:4} et des grilles 3x2 @grid{cols:3, rows:2}.
```

En mode **block**, on peut écrire plus facilement du texte sur plusieurs lignes :

@code{src:"block.md"}
