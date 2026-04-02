# Démarrage rapide

`vite-plugin-image-optimize` s'intègre dans n'importe quel projet Vite en deux étapes : installer le package, ajouter le plugin à la config.

---

## Prérequis

| Dépendance | Version minimale |
|---|---|
| Node.js | 18.17.0 |
| Vite | 4+ |

---

## Installation

```bash
npm install vite-plugin-image-optimize --save-dev
```

---

## Configuration

Ajoutez le plugin dans votre `vite.config.ts` (ou `vite.config.js`) :

```js
import { defineConfig } from 'vite'
import imageOptimize from 'vite-plugin-image-optimize'

export default defineConfig({
  plugins: [
    imageOptimize()
  ]
})
```

C'est tout. Le plugin s'exécute automatiquement à chaque `vite build` avec les réglages par défaut.

---

## Configuration avec options

Toutes les options sont facultatives. Surchargez uniquement ce dont vous avez besoin :

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

Pour la liste complète des options, consultez la [référence Options](../reference/options.md).

---

## Structure de répertoire attendue

Le plugin scanne deux répertoires :

| Phase | Répertoire | Description |
|---|---|---|
| Pré-build | `<publicDir>/img/` | Images sources - les JPEG/PNG sont convertis en WebP/AVIF ici |
| Post-build | `<outDir>/img/` | Sortie du build - toutes les images sont compressées en place ici |

Ces chemins sont résolus depuis `config.publicDir` et `config.build.outDir` de Vite, non codés en dur. Ils s'adaptent automatiquement si vous configurez des valeurs personnalisées dans votre config Vite.

> Si `/public/img/` n'existe pas, la phase pré-build est silencieusement ignorée. Si `/dist/img/` n'existe pas après le build, la phase post-build est également ignorée.

---

## Vérifier la sortie

Pendant le `vite build`, le plugin affiche deux sections dans le terminal :

```bash
----------------------------------------
🖼️  Image Optimize (Pre-build)
----------------------------------------
✅ Modern formats generated (4):
  logo.png → logo.webp
  logo.png → logo.avif
  banner.jpg → banner.webp
  banner.jpg → banner.avif

----------------------------------------
🖼️  Image Optimize (Post-build)
----------------------------------------
✅ Images optimized (6):
  logo.png - 98.2 KB → 41.5 KB (57.7% saved)
  logo.webp - 62.1 KB → 28.3 KB (54.4% saved)
  logo.avif - 44.8 KB → 20.1 KB (55.1% saved)
  banner.jpg - 1.1 MB → 620.8 KB (43.5% saved)
  banner.webp - 890.2 KB → 410.3 KB (53.9% saved)
  banner.avif - 650.1 KB → 280.5 KB (56.8% saved)
📦 Total: 2.8 MB → 1.4 MB (50.2% saved)
```

Pour réduire le bruit dans le terminal, utilisez `logListings: false` pour n'afficher que la ligne de résumé.
