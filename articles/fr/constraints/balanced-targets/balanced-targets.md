# Cibles aléatoires mais équilibrées

Soient `n` personnes.
Chacune reçoit une liste de `k` (`0<k<n`) cibles parmi les `n-1` autres personnes.

Comment faire pour distribuer aléatoirement et le plus simplement possible
les cibles en respectant les contraintes suivantes :

* Chaque personne reçoit exactement `k` cibles distinctes.
* Chaque personne est ciblée par exactement `k` autres personnes distinces.

## Cas particuliers

Pour étudier les cas particuliers (avec `n` le nombre de joueurs), on va utiliser
des grilles de `n` colonnes et `n` lignes telles que chaque ligne et chaque
colonne compte exactement `c` croix. Avec `c` étant le nombre de cibles par joueur.

### n = 3

La seule possibilité est la suivante et elle donne toutes les informations
possible à chaque joueur concernant les cibles des autres.

@grid"AC,BA,CB"

### n = 4

Avec 4 joueurs, les cas avec 1 ou 3 cibles sont triviaux.
Nous nous intéressons donc au cas où chaque joueur a deux cibles.
Voici toutes les possibilités de distribution des cibles :

@grid"ABC,BAD,CAD,DBC"
@grid"ABC,BAD,CBD,DAC"
@grid"ABC,BCD,CAD,DAB"
@grid"ABD,BAC,CAD,DBC"
@grid"ABD,BAC,CBD,DAC"
@grid"ABD,BCD,CAB,DAC"
@grid"ACD,BAC,CBD,DAB"
@grid"ACD,BAD,CAB,DBC"
@grid"ACD,BCD,CAB,DAB"

Il semble y avoir 9 combinaisons différentes, mais nous allons voir
qu'il n'y en a effectivement que __3__ qui comptent vraiment.

Pour cela, plaçons nous du point de vue d'un des joueurs qui reçoit deux cibles.
On peut donc appeler ce joueur __A__ et ses cibles __B__ et __C__. Dans ce cas,
on est forcément dans un de ces trois cas :

@grid{grid:"ABC,BAD,CAD,DBC",label:"A3,B1,C3,D1"}
@grid{grid:"ABC,BAD,CBD,DAC",label:"A3,B1,C2,D2"}
@grid{grid:"ABC,BCD,CAD,DAB",label:"A3,B3,C3,D3"}

La seule chose que __A__ peut déduire pour sûr,
c'est que ses deux cibles ont pour cible __D__.
Mais ça reste acceptable pour le jeu.

Maintenant, il nous faut un système simple d'attribution des cibles
de sorte à être dans l'un de ces trois cas de figure.

Les labels au dessus des grilles indiquent quel joueur n'est pas la cible d'un
autre. Par exemple `A3` signifie que _A_ cible tous les autres joueurs
sauf le troisième à sa gauche. Et `B2` signifie que __B__ a pour cibles
les autres joueurs sauf le deuxième à sa droite, c'est-à-dire __D__.

On a donc les cycles suivants :

* `3131`
* `3122`
* `3333`

Ce qui nous donne les 7 tirages suivants :

```
1-+-2---2---3
| ⌙-3---1---3
2-+-2---3---1
| ⌙-3---1---2
3-+-1-+-2---2
  |   ⌙-3---1
  ⌙-3---3---3
```

Par exemple, le tirage `2231` nous dit que le joueur __A__ a pour cibles
__B__ et __D__, __B__ a pour cible __C__ et __A__, etc.
Ce qui nous donne ceci:

@grid"ABD,BAC,CAD,DBC"

Pour dessiner une telle grille, il suffit de partir d'une case grise et
de ne pas mettre de crois dans la i-ème case sur sa droite.

Ainsi, on peut dessiner les 7 cartes suivantes :

@card"1223" @card"1313" @card"2231" @card"2312" @card"3122" @card"3131" @card"3333"
