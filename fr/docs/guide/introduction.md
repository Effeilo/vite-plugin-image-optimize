# Introduction

## Qu'est-ce que `vite-plugin-image-optimize` ?

`vite-plugin-image-optimize` est un plugin Vite qui gère l'optimisation des images automatiquement lors des builds de production. Il génère des alternatives en formats modernes (`.avif`, `.webp`) à partir de vos fichiers JPEG et PNG sources, puis compresse toutes les images du répertoire de sortie pour réduire leur poids.

Il s'intègre directement dans le pipeline de build Vite via deux hooks, ne nécessite aucune commande manuelle et produit une amélioration de performance mesurable à chaque build.

---

## Pourquoi ce plugin ?

Les images sont les assets les plus lourds sur la majorité des pages web. Servir des images non optimisées a un impact direct sur :

- **Performance** : les images volumineuses ralentissent le chargement initial, surtout sur les réseaux mobiles.
- **Core Web Vitals** : le Largest Contentful Paint (LCP) est directement influencé par le poids des images.
- **Bande passante** : les utilisateurs sur connexions limitées paient chaque octet transféré.

Les formats d'image modernes adressent significativement ce problème :

| Format | Économie typique par rapport au JPEG |
|---|---|
| WebP | 25 à 35 % plus léger |
| AVIF | 40 à 60 % plus léger |

`vite-plugin-image-optimize` automatise la génération et la compression de ces formats pour que vous n'ayez pas à les gérer manuellement.

---

## L'approche en deux phases

Le plugin s'exécute en deux phases distinctes pendant `vite build` :

### Phase 1 - Pré-build (génération des formats)

Avant que Vite ne traite vos fichiers, le plugin scanne `/public/img` à la recherche d'images JPEG et PNG et génère des versions `.webp` et/ou `.avif` à côté de chaque fichier source. Les fichiers déjà à jour sont ignorés.

### Phase 2 - Post-build (compression)

Après que Vite ait copié tous les assets dans le répertoire de sortie, le plugin compresse chaque image dans `/dist/img` en place, en utilisant [sharp](https://sharp.pixelplumbing.com/) pour les formats raster et [svgo](https://svgo.dev/) pour les SVG. Le traitement est entièrement parallélisé.

---

## Positionnement

`vite-plugin-image-optimize` est concentré et délibéré :

- Il ne traite pas les images en dehors de `/public/img` et `/dist/img`
- Il ne renomme ni ne déplace les fichiers
- Il ne nécessite pas d'étape CLI séparée ni de commande manuelle
- Il ne s'exécute que lors des builds de production (`apply: 'build'`)

Il fait une seule chose : rendre vos images plus légères et disponibles en formats modernes, automatiquement, à chaque `vite build`.

---

## Ce que `vite-plugin-image-optimize` ne fait pas

- Pas de redimensionnement responsive (multiples tailles, génération de `srcset`)
- Pas d'attributs de lazy loading
- Pas d'intégration CDN d'images
- Pas de traitement des images en arrière-plan CSS
- Pas de traitement des images importées directement en JavaScript/TypeScript
