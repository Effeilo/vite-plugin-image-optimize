# Compatibilité

---

## Prérequis d'exécution

| Dépendance | Version minimale | Raison |
|---|---|---|
| Node.js | 18.17.0 | Requis par [sharp](https://sharp.pixelplumbing.com/install#nodejs-versions) |
| Vite | 4+ | Compatibilité API plugin (`configResolved`, `buildStart`, `closeBundle`) |

---

## Compatibilité des versions Vite

| Version Vite | Statut |
|---|---|
| Vite 4 | Supporté |
| Vite 5 | Supporté |
| Vite 6 | Supporté |
| Vite 7 | Supporté |

Le plugin utilise les APIs hook Rollup standard (`buildStart`, `closeBundle`, `configResolved`) qui sont stables sur toutes les versions Vite listées.

---

## Notes par système d'exploitation

### Windows

Sous Windows, `sharp(filePath)` peut garder un descripteur de fichier natif ouvert après le traitement, provoquant une erreur `UNKNOWN` quand Node.js tente d'écrire dans le même fichier. Ce plugin utilise `sharp(buffer)` dans la phase post-build pour éviter entièrement ce problème.

### macOS et Linux

Aucun problème de compatibilité connu. Le plugin est testé sur les deux plateformes.

---

## Support navigateur des formats d'image

Le plugin génère des fichiers `.avif` et `.webp`. Ces formats nécessitent un support navigateur pour être utilisés. Incluez toujours un fallback JPEG ou PNG dans votre HTML via l'élément `<picture>`.

Consultez [Utilisation HTML](guide/html-usage.md) pour les détails d'implémentation.

| Format | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| WebP | 32+ | 65+ | 14+ | 18+ |
| AVIF | 85+ | 93+ | 16.1+ | 121+ |

---

## Dépendances

| Package | Rôle | Version |
|---|---|---|
| [sharp](https://sharp.pixelplumbing.com/) | Traitement JPEG, PNG, WebP, AVIF | ^0.34 |
| [svgo](https://svgo.dev/) | Optimisation SVG | ^3 |
| [globby](https://github.com/sindresorhus/globby) | Scan du système de fichiers avec patterns glob | ^13 |

---

## Notes

### `sharp` sous Windows

`sharp` embarque un binaire natif précompilé pour chaque plateforme. Sous Windows, le binaire est téléchargé automatiquement lors du `npm install`. En cas d'échec de l'installation, consultez le [guide d'installation de sharp](https://sharp.pixelplumbing.com/install).

### `sharp` et les versions Node.js

`sharp` requiert Node.js 18.17.0 ou supérieur à partir de la version 0.33. Utiliser une version de Node.js plus ancienne provoquera l'échec de l'installation avec une erreur de module natif.
