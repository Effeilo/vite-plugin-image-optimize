[EN](../README.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# BrowserUX Image Optimize

**Optimisez automatiquement vos images pour des temps de chargement plus rapides et des performances maximales.**

BrowserUX Image Optimize est un plugin Vite configurable qui génère des versions `.avif` et `.webp` de vos images avant le build, puis compresse intelligemment tous les fichiers JPG, PNG, SVG, AVIF et WebP après le build. Grâce à une configuration simple, vous contrôlez la qualité, les formats cibles et les exclusions. Idéal pour réduire le poids des assets en production sans perte de qualité visible, et pour booster vos scores de performance Lighthouse.

- [Site du projet](https://browserux.com/fr/image-optimize/)
- [Documentation](./docs/index.md)
- [Changelog](./CHANGELOG.md)

<br>

[![npm version](https://img.shields.io/npm/v/vite-plugin-image-optimize.svg)](https://www.npmjs.com/package/vite-plugin-image-optimize)
![vite compatibility](https://img.shields.io/badge/Vite-4%2B%20%7C%205%2B%20%7C%206%2B%20%7C%207%2B-646CFF.svg?logo=vite&logoColor=white)

## Fonctionnalités

- 🖼️ Génère `.avif` et `.webp` depuis les `.jpg`/`.png` dans `/public/img`
- 🚀 Optimise les images dans `/dist/img` (JPG, PNG, SVG, WebP, AVIF)
- ⚡ Traitement parallèle avec `Promise.all` pour des builds rapides
- 🔁 Ignore les fichiers déjà à jour lors de la phase pré-build
- 🔍 Supporte l'exclusion de fichiers via glob
- 🔧 Qualité configurable par format
- 📦 Affiche un rapport de compression détaillé (optionnel)
- 🛠️ Propulsé par [sharp](https://sharp.pixelplumbing.com/) et [svgo](https://svgo.dev/)

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

## Utilisation

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
      exclude: [],
      logListings: true
    })
  ]
})
```

## Options

| Option | Type | Par défaut | Description |
| --- | --- | --- | --- |
| `jpegQuality` | `number` | `80` | Qualité de compression JPEG (0-100) |
| `pngQuality` | `number` | `80` | Qualité de compression PNG (0-100) |
| `webpQuality` | `number` | `75` | Qualité de conversion/compression WebP (0-100) |
| `avifQuality` | `number` | `50` | Qualité de conversion/compression AVIF (0-100) |
| `webpEnable` | `boolean` | `true` | Active la génération WebP lors du pré-build |
| `avifEnable` | `boolean` | `true` | Active la génération AVIF lors du pré-build |
| `exclude` | `string[]` | `[]` | Patterns glob à exclure de tout traitement |
| `logListings` | `boolean` | `true` | Active le log détaillé fichier par fichier |

## Migration depuis la v1

| Option v1 | Équivalent v2 | Notes |
| --- | --- | --- |
| `pngQuality` | `pngQuality` | Type modifié : `[number, number]` → `number` (0-100) |
| `webpFormats` | *(supprimé)* | Le plugin cible toujours `.jpg`/`.jpeg`/`.png` |
| `webpExclude` | `exclude` | S'applique désormais aux deux phases de traitement |

## Documentation

Pour la documentation complète, consultez [docs/fr/index.md](../docs/fr/index.md).

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

## Licence

MIT © 2026 [Effeilo](https://github.com/Effeilo)
