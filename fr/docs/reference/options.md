# Options

Toutes les options sont passées sous forme d'un objet unique à la fonction `imageOptimize()`. Chaque option est facultative - le plugin fonctionne sans aucune configuration.

```js
imageOptimize({
  jpegQuality: 80,
  pngQuality: 80,
  webpQuality: 75,
  avifQuality: 50,
  webpEnable: true,
  avifEnable: true,
  exclude: [],
  logListings: true
})
```

---

## Référence rapide

| Option | Type | Par défaut | Description |
|---|---|---|---|
| `jpegQuality` | `number` | `80` | Qualité de compression JPEG (0-100) |
| `pngQuality` | `number` | `80` | Qualité de compression PNG (0-100) |
| `webpQuality` | `number` | `75` | Qualité WebP (0-100) |
| `avifQuality` | `number` | `50` | Qualité AVIF (0-100) |
| `webpEnable` | `boolean` | `true` | Active la génération WebP en pré-build |
| `avifEnable` | `boolean` | `true` | Active la génération AVIF en pré-build |
| `exclude` | `string[]` | `[]` | Patterns glob à exclure de tout traitement |
| `logListings` | `boolean` | `true` | Active la sortie terminal détaillée par fichier |

---

## Options de qualité

### `jpegQuality`

**Type :** `number` - **Par défaut :** `80`

Contrôle la qualité de compression appliquée aux fichiers `.jpg` et `.jpeg` lors de la phase post-build. Utilise [l'encodeur JPEG de sharp](https://sharp.pixelplumbing.com/api-output#jpeg) avec `mozjpeg: true` pour une meilleure compression à qualité visuelle équivalente.

- `100` : quasi sans perte, fichier le plus lourd
- `80` : bon équilibre entre qualité et taille (recommandé)
- `60` et en dessous : artefacts visibles sur la plupart des images

```js
imageOptimize({ jpegQuality: 75 })
```

---

### `pngQuality`

**Type :** `number` - **Par défaut :** `80`

Contrôle la qualité de compression appliquée aux fichiers `.png` lors de la phase post-build. Utilise l'encodeur PNG de sharp avec `compressionLevel: 9` (compression zlib maximale) en plus de la quantification par qualité.

```js
imageOptimize({ pngQuality: 85 })
```

---

### `webpQuality`

**Type :** `number` - **Par défaut :** `75`

Contrôle la qualité utilisée lors de :
- la génération des versions `.webp` des fichiers JPEG/PNG en pré-build
- la recompression des fichiers `.webp` existants en post-build

Le WebP à 75 est visuellement comparable au JPEG à 85-90 pour la plupart des images.

```js
imageOptimize({ webpQuality: 80 })
```

---

### `avifQuality`

**Type :** `number` - **Par défaut :** `50`

Contrôle la qualité utilisée lors de :
- la génération des versions `.avif` des fichiers JPEG/PNG en pré-build
- la recompression des fichiers `.avif` existants en post-build

L'AVIF utilise une échelle de qualité différente du JPEG ou du WebP. Des valeurs plus basses produisent des fichiers plus petits avec une compression plus forte. `50` est un bon point de départ ; les valeurs dans la plage `40-60` sont courantes en production.

```js
imageOptimize({ avifQuality: 45 })
```

---

## Options de génération de formats

### `webpEnable`

**Type :** `boolean` - **Par défaut :** `true`

Quand `true`, la phase pré-build génère une version `.webp` pour chaque fichier `.jpg`, `.jpeg` et `.png` trouvé dans `<publicDir>/img/`.

Mettez à `false` pour ignorer entièrement la génération WebP :

```js
imageOptimize({ webpEnable: false })
```

> Mettre `webpEnable` et `avifEnable` à `false` désactive entièrement la phase pré-build.

---

### `avifEnable`

**Type :** `boolean` - **Par défaut :** `true`

Quand `true`, la phase pré-build génère une version `.avif` pour chaque fichier `.jpg`, `.jpeg` et `.png` trouvé dans `<publicDir>/img/`.

Mettez à `false` pour ignorer la génération AVIF :

```js
imageOptimize({ avifEnable: false })
```

---

## Options de filtrage

### `exclude`

**Type :** `string[]` - **Par défaut :** `[]`

Un tableau de patterns glob. Tout fichier correspondant à l'un de ces patterns est exclu des **deux** phases, pré-build et post-build.

Les patterns sont passés à [globby](https://github.com/sindresorhus/globby) comme règles `ignore` et sont appariés relativement au répertoire scanné.

```js
imageOptimize({
  exclude: [
    '**/og-*.png',        // exclure les images Open Graph
    '**/icons/**',        // exclure un sous-répertoire entier
    '**/*-raw.*'          // exclure les fichiers avec un suffixe spécifique
  ]
})
```

---

## Options de journalisation

### `logListings`

**Type :** `boolean` - **Par défaut :** `true`

Quand `true`, le plugin affiche un rapport détaillé par fichier pour les deux phases de build :

```bash
✅ Images optimized (4):
  logo.png - 98.2 KB → 41.5 KB (57.7% saved)
  banner.jpg - 1.1 MB → 620.8 KB (43.5% saved)
  banner.webp - 890.2 KB → 410.3 KB (53.9% saved)
  banner.avif - 650.1 KB → 280.5 KB (56.8% saved)
📦 Total: 2.8 MB → 1.4 MB (50.2% saved)
```

Quand `false`, seule une ligne de résumé est affichée :

```bash
✅ 4 images optimized in /dist/img
```

```js
imageOptimize({ logListings: false })
```
