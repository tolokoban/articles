# Widget pour faire des dessins géométriques

@editor{}

Un **point** est défini par une unique lettre majuscule, éventuellement
suivie par une série de chiffres et/ou une série d'apostrophes.

* `A(3,2)` : définir un point en `x=3` et `y=2`. Il ne sera pas affiché par défaut.
* `M[AC]`, `O[ABC]`, `K[2X 3Y]` : définir un point comme barycentre.
* `(AB)` : tracer une droite passant par deux points.
* `(A|B)` : tracer la médiatrice au segment [AB].
* `[AB]` : tracer un segment.
* `[ABCD]` : tracer un polygône.
* `{ABC}` : afficher les points.
* `@ C 2.56` : tracer un cercle de centre `C` et de rayon `2.56`.
* `@ C M` : tracer un cercle de centre `C` passant par `M`.
* `@ C 12 / 5.22` : tracer une ellipse de centre `C` de rayon horizontal `12` et vertical `5.22`.
* `@ C M ; 30,120` : tracer un arc de cercle de centre `C` passant par `M` partant de l'angle `30°` jusqu'à `120°`.
* `~[ABDEF]` : Courbe de Bézier quadratique passant par A, D et F, avec les points de contrôle B et E.
* `~(ABCD)` : Courbe de Bézier cubique passant par A et D, avec les points de contrôle B et C.
* `% 3` : dorénavant, les traits ont une épaisseur de 3.
* `#02` : définit la couleur du trait (`0`) et du remplissage (`2`).

Tableau des couleurs :

| 0           | 1    | 2        | 3          | 4      |
| ----------- | ---- | -------- | ---------- | ------ |
| transparent | noir | primaire | secondaire | grille |

Couleurs claires :

| 5        | 6          |
| -------- | ---------- |
| primaire | secondaire |

Couleurs semi-transparentes :

| 7    | 8        | 9          |
| ---- | -------- | ---------- |
| noir | primaire | secondaire |

Couleurs fixes :

| R     | G    | B    | W     |
| ----- | ---- | ---- | ----- |
| rouge | vert | bleu | blanc |

Couleurs fixes semi-transparentes :

| r     | g    | b    | w     |
| ----- | ---- | ---- | ----- |
| rouge | vert | bleu | blanc |
