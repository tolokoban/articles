# Et si on faisait un jeu vidéo ?

Ce matin, je me lève et je me dis que je ferais bien un jeu du genre Pac-Man,
mais en 3D et avec un graphisme qui donne l'impression que tout est fait en
carton.

## Le concept

Il me faut donc un concept art. Comme ça va être en 3D, j'utilise Blender et
je commence par me faire un grand plan subdivisé.

![Grand plan subdivisé](./concept-blender-1.webp)

Puis je découpe et déplace verticalement des chemins, applique un Solidify et ajoute
un Pac-Man et quelques fantômes. Ça donne à peu près ça :

![Concept](./concept-blender-2.webp)

## Affichage 3D

Ok, alors il va falloir du code pour afficher des polygônes en perspective.
On va donc commencer par programmer un carré à plat sur le sol avec une caméra qui va orbiter autour en le regardant en plongée.

On définit notre caméra par le point qu'elle vise (__target__),
la distance à laquelle se trouve la caméra et deux angles qu'on appellera
__longitude__ et __latitude__.

```g
O(0,0) X(1,0) Y(0,0.38) Z(0,1)
A(1,0.5) B(-1,0.5)
A2(1,1.35) B2(-1,1.35)
A'(1,-0.5) B'(-1,-0.5)
I'(-1,0)
M(0.82,0.6)
#39 %2
{OXYZM}
~(I'BAXA'B'I')
#30
~(XA2B2I')
#10 %1
[OX][OY]
#20 %2
[OM]
```
