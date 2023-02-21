# Télécharger des vidéos pour références

Il est parfois pratique d'utiliser une vidéo comme référence pour une animation
que l'on souhaite dessiner. Pour cela, on peut utiliser l'outil `youtube-dl`
pour récupérer la section qui nous intéresse.

C'est un outil écrit en Python et il peut donc s'installer comme ceci :

```sh
sudo pip install --upgrade youtube_dl
```

Ensuite, on utilise `ffmpeg` pour en extraire les images sur une partie.

```sh
ffmpeg -ss 34 -t 3 -i ./taekwondo.mp4 frame-%03d.jpg
```
