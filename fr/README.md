[EN](../README.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# BrowserUX Image Optimize

`vite-plugin-image-optimize` est un plugin Vite qui génère automatiquement des versions `.avif` et `.webp` de vos images et optimise tous vos fichiers JPG, PNG, SVG, WebP et AVIF pour améliorer les performances de votre site.

[![npm version](https://img.shields.io/npm/v/vite-plugin-image-optimize.svg)](https://www.npmjs.com/package/vite-plugin-image-optimize)
![vite compatibility](https://img.shields.io/badge/Vite-4%2B%20%7C%205%2B%20%7C%206%2B%20%7C%207%2B-646CFF.svg?logo=vite&logoColor=white)

## Pourquoi ce plugin ?

Ce plugin Vite a été créé pour le BrowserUX Starter, un starter frontend avec Vite, PWA et Workbox. Il génère automatiquement des fichiers `.avif` et `.webp` et compresse toutes les images (JPG, PNG, SVG, WebP, AVIF) lors du build de production, grâce à [sharp](https://sharp.pixelplumbing.com/) — une bibliothèque de traitement d'images rapide et activement maintenue.

Le plugin gère deux étapes :

- **Avant le build :** convertit les images JPEG/PNG en AVIF et/ou WebP dans `/public/img`. Les fichiers déjà à jour sont ignorés.
- **Après le build :** compresse toutes les images dans `/dist/img` en parallèle pour réduire la taille de l'output.

## Fonctionnalités

- 🖼️ Génère `.avif` et `.webp` depuis les `.jpg`/`.png` dans `/public/img`
- 🚀 Optimise les images dans `/dist/img` (JPG, PNG, SVG, WebP, AVIF)
- ⚡ Traitement parallèle avec `Promise.all` pour des builds rapides
- 🔁 Ignore les fichiers déjà à jour lors de la phase de pré-build
- 🔍 Supporte l'exclusion de fichiers via glob
- 🔧 Paramétrable : qualité AVIF, WebP, PNG, JPEG
- 📦 Affiche un rapport de compression détaillé (optionnel)
- 🛠️ Propulsé par [sharp](https://sharp.pixelplumbing.com/) et [svgo](https://svgo.dev/)

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

## Utilisation

Dans le fichier `vite.config.ts` :

```js
import { defineConfig } from 'vite'
import imageOptimize from 'vite-plugin-image-optimize'

export default defineConfig({
  plugins: [
    imageOptimize({
      jpegQuality: 80,
      pngQuality: 80,
      webpQuality: 75,
      avifQuality: 50,
      webpEnable: true,
      avifEnable: true,
      exclude: ['**/og-*.png'],
      logListings: true
    })
  ]
})
```

## Utilisation HTML recommandée

Servez l'AVIF avec le WebP et le JPEG en fallback via `<picture>` :

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>
```

Le navigateur choisit le premier format qu'il supporte. L'AVIF offre la meilleure compression ; le JPEG est le fallback universel.

## Exemple d'output

Dans votre terminal, pendant le `vite build` :

```bash
----------------------------------------
🖼️  Image Optimize (Pre-build)
----------------------------------------
✅ Modern formats generated (6):
  banner.jpg → banner.webp
  banner.jpg → banner.avif
  logo.png → logo.webp
  logo.png → logo.avif

----------------------------------------
🖼️  Image Optimize (Post-build)
----------------------------------------
✅ Images optimized (8):
  logo.png — 120.4 KB → 52.1 KB (56.7% saved)
  banner.jpg — 1.1 MB → 620.8 KB (43.5% saved)
  banner.webp — 890.2 KB → 410.3 KB (53.9% saved)
  banner.avif — 650.1 KB → 280.5 KB (56.8% saved)
📦 Total: 2.8 MB → 1.4 MB (50.2% saved)
```

## Options

| Option         | Type       | Par défaut | Description                                                                     |
| -------------- | ---------- | ---------- | ------------------------------------------------------------------------------- |
| `jpegQuality`  | `number`   | `80`       | Qualité de compression JPEG (0–100)                                             |
| `pngQuality`   | `number`   | `80`       | Qualité de compression PNG (0–100)                                              |
| `webpQuality`  | `number`   | `75`       | Qualité de conversion/compression WebP (0–100)                                  |
| `avifQuality`  | `number`   | `50`       | Qualité de conversion/compression AVIF (0–100, plus bas = fichier plus petit)   |
| `webpEnable`   | `boolean`  | `true`     | Active la génération WebP lors du pré-build                                     |
| `avifEnable`   | `boolean`  | `true`     | Active la génération AVIF lors du pré-build                                     |
| `exclude`      | `string[]` | `[]`       | Glob patterns à exclure de tout traitement (ex. `['**/ignore/**']`)             |
| `logListings`  | `boolean`  | `true`     | Active le log détaillé fichier par fichier                                      |

## Migration depuis la v1

| Option v1      | Équivalent v2  | Notes                                              |
| -------------- | -------------- | -------------------------------------------------- |
| `pngQuality`   | `pngQuality`   | Type modifié : `[number, number]` → `number` (0–100) |
| `webpFormats`  | *(supprimé)*   | Le plugin cible toujours `.jpg`/`.jpeg`/`.png`     |
| `webpExclude`  | `exclude`      | S'applique désormais aux deux phases de traitement |

## Structure du dépôt

```bash
├── dist/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── utils.ts
│   └── types/
│       └── shims.d.ts
├── tsconfig.json
├── package.json
├── README.md
```

## Fonctionnement interne (en bref)

- Avant le build : convertit les PNG/JPEG en AVIF et WebP dans `public/img` (ignore les fichiers à jour)
- Après le build : optimise toutes les images dans `dist/img` en parallèle
- Affiche un résumé avec les tailles gagnées (optionnel)

## Licence

MIT © 2025 [Effeilo](https://github.com/Effeilo)
