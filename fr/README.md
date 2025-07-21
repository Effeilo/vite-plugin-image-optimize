[EN](../README.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# BrowserUX Image Optimize

`vite-plugin-image-optimize` est un plugin Vite qui génère automatiquement des versions `.webp` de vos images et optimise tous vos fichiers JPG, PNG, SVG et WebP pour améliorer les performances de votre site.

[![npm version](https://img.shields.io/npm/v/vite-plugin-image-optimize.svg)](https://www.npmjs.com/package/vite-plugin-image-optimize)
![vite compatibility](https://img.shields.io/badge/Vite-4%2B%20%7C%205%2B%20%7C%206%2B%20%7C%207%2B-646CFF.svg?logo=vite&logoColor=white)

## Pourquoi ce plugin ?

Ce plugin Vite a été créé pour le BrowserUX Starter, un starter frontend avec Vite, PWA et Workbox, afin de générer automatiquement des fichiers .webp et d’optimiser toutes les images (JPG, PNG, SVG, WebP) pour de meilleures performances en production.

Ce plugin gère deux étapes :

- Avant le build : convertit les images JPEG et PNG en WebP dans `/public/img`
- Après le build : compresse toutes les images dans `/dist/img` pour réduire la taille de l’output


## Fonctionnalités

- 🖼️ Génère automatiquement des `.webp` depuis les `.jpg`/`.png` dans `/public/img`
- 🚀 Optimise les images compressibles dans `/dist/img` (JPG, PNG, SVG, WebP)
- 🔍 Supporte l’exclusion de fichiers via glob
- 🔧 Paramétrable : qualité WebP, PNG, JPEG, extensions à cibler
- 📦 Affiche un rapport de compression détaillé (optionnel)

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
      pngQuality: [0.6, 0.8],
      webpQuality: 75,
      webpEnable: true,
      webpFormats: ['jpeg', 'png'],
      webpExclude: ['**/logo.svg'],
      logListings: true
    })
  ]
})
```

## Exemple d'output

Dans votre terminal, pendant le `build` :

```bash
----------------------------------------
🖼️  BrowserUX Image Optimize (Pre-build)           
----------------------------------------
✅ WebP generated (3):
- logo.png → logo.webp
- banner.jpg → banner.webp
- icons/menu.png → icons/menu.webp

----------------------------------------
🖼️  BrowserUX Image Optimize (Post-build)           
----------------------------------------
✅ Images optimized (6):
- logo.png - 120.4 KB → 52.1 KB (56.7% saved)
- banner.jpg - 1.1 MB → 620.8 KB (43.5% saved)
📦 Total: 1.4 MB → 690.2 KB (50.4% saved)
```

## Options

| Option        | Type                  | Par défaut        | Description                                               |
| ------------- | --------------------- | ----------------- | --------------------------------------------------------- |
| `jpegQuality` | `number`              | `80`              | Qualité pour la compression JPEG (0–100)                  |
| `pngQuality`  | `[number, number]`    | `[0.6, 0.8]`      | Plage de qualité PNG (entre 0 et 1)                       |
| `webpQuality` | `number`              | `75`              | Qualité de conversion WebP (0–100)                        |
| `webpEnable`  | `boolean`             | `true`            | Active ou non la génération des fichiers WebP avant build |
| `webpFormats` | `('jpeg' \| 'png')[]` | `['jpeg', 'png']` | Extensions concernées par la conversion WebP              |
| `webpExclude` | `string[]`            | `[]`              | Glob patterns à exclure (ex. `['**/ignore/**']`)          |
| `logListings` | `boolean`             | `true`            | Active le log détaillé fichier par fichier                |

## Structure du dépôt

```bash
├── dist/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── utils.ts
│   └── types/
│   │   └── shims.d.ts
├── tsconfig.json
├── package.json
├── README.md
```

## Fonctionnement interne (en bref)

- Avant le build : convertit les PNG/JPEG en WebP dans public/img
- Après le build : optimise les images dans dist/img
- Affiche un résumé avec les tailles gagnées (optionnel)

## Licence

MIT © 2025 [Effeilo](https://github.com/Effeilo)