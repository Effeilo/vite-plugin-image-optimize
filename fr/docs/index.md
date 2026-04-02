# Documentation `vite-plugin-image-optimize`

## Le projet

Chaque build de production embarque des images. Mais les images brutes sont lourdes : PNG non optimisés, JPEG sans compression, aucune alternative en format moderne. Résultat : des pages plus lentes, de la bande passante gaspillée et une mauvaise expérience utilisateur, surtout sur mobile.

`vite-plugin-image-optimize` règle tout ça automatiquement. Il génère des versions `.avif` et `.webp` de vos images sources avant le build, puis compresse chaque image du répertoire de sortie après le build - en parallèle, sans intervention manuelle.

Un seul plugin. Deux phases. Aucune configuration requise pour démarrer.

---

## Table des matières

### Guide

- [Introduction](guide/introduction.md) : ce que c'est, pourquoi ça existe, l'approche en deux phases
- [Démarrage rapide](guide/getting-started.md) : installation et configuration dans `vite.config`
- [Fonctionnement](guide/how-it-works.md) : génération pré-build, compression post-build, builds incrémentaux
- [Utilisation HTML](guide/html-usage.md) : servir AVIF/WebP avec fallback via `<picture>`

### Référence

- [Options](reference/options.md) : tableau complet des options avec détails et valeurs par défaut
- [Hooks](reference/hooks.md) : `configResolved`, `buildStart`, `closeBundle`
- [Utilitaires](reference/utils.md) : `getAllImages`, `fileIsNewer`, `formatSize`

### Référence additionnelle

- [Compatibilité](compatibility.md) : Node.js, versions Vite, support navigateur des formats d'image
- [Contribuer](contributing.md) : signaler un bug, proposer une amélioration, soumettre une PR
