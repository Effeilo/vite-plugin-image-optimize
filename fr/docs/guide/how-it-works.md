# Fonctionnement

`vite-plugin-image-optimize` s'accroche au cycle de vie du build Vite en deux points. Comprendre le fonctionnement de chaque phase permet de configurer le plugin correctement et d'anticiper son comportement.

---

## Vue d'ensemble du cycle de build

```
vite build
│
├── configResolved     → résolution des chemins public/img et dist/img
├── buildStart         → Phase 1 : génération WebP/AVIF dans public/img
│
│   [Vite traite les modules, émet les assets, copie public/ vers dist/]
│
└── closeBundle        → Phase 2 : compression de toutes les images dans dist/img
```

---

## Phase 1 - Génération des formats pré-build

**Hook :** `buildStart`

Le plugin scanne `<publicDir>/img/` à la recherche de fichiers `.jpg`, `.jpeg` et `.png`. Pour chaque fichier source, il génère des versions `.webp` et/ou `.avif` dans le même répertoire en utilisant [sharp](https://sharp.pixelplumbing.com/).

### Génération incrémentale

Un fichier n'est régénéré que si la source est plus récente que la sortie existante. Cette vérification utilise `fs.stat` pour comparer les horodatages de modification :

- Si le fichier `.webp` ou `.avif` existe déjà et est à jour → ignoré
- Si la sortie n'existe pas, ou est plus ancienne que la source → régénérée

Cela signifie que les builds répétés sont rapides : aucun ré-encodage sur les images inchangées.

### Parallélisation

Toutes les conversions s'exécutent simultanément avec `Promise.all`. Sur un projet avec de nombreuses images, cela réduit significativement le temps de pré-build par rapport à un traitement séquentiel.

---

## Phase 2 - Compression post-build

**Hook :** `closeBundle`

Après que Vite ait copié tous les assets dans `<outDir>/img/`, le plugin lit chaque image de ce répertoire (`.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`, `.avif`) et la compresse en place.

### Stratégie par format

| Format | Bibliothèque | Réglages |
|---|---|---|
| JPEG | sharp | `mozjpeg: true`, qualité configurable |
| PNG | sharp | `compressionLevel: 9`, qualité configurable |
| WebP | sharp | qualité configurable |
| AVIF | sharp | qualité configurable |
| SVG | svgo | `multipass: true` |

### Traitement par buffer

Pour éviter les problèmes de verrouillage de fichiers sous Windows, les images sont d'abord chargées en mémoire avec `fs.readFile`. Le buffer est passé à `sharp(buffer)` au lieu de `sharp(filePath)`, afin que sharp ne conserve jamais de descripteur de fichier ouvert quand `fs.writeFile` réécrit le résultat.

### Parallélisation

Toutes les compressions s'exécutent également avec `Promise.all`. Le plugin affiche un rapport par fichier et un résumé des économies totales quand `logListings` est activé.

---

## Exclusions

L'option `exclude` accepte des patterns glob appliqués aux deux phases. Les fichiers correspondant à un pattern sont entièrement ignorés :

```js
imageOptimize({
  exclude: ['**/og-*.png', '**/icons/**']
})
```

Les patterns sont passés à [globby](https://github.com/sindresorhus/globby) comme règles `ignore`.

---

## Comportement build uniquement

Le plugin déclare `apply: 'build'`. Ses hooks ne sont jamais enregistrés pendant `vite dev` ou `vite preview`. Le serveur de développement ne génère ni ne compresse aucune image.

---

## Résolution des chemins

Les chemins de répertoires sont résolus dans le hook `configResolved` depuis la configuration résolue de Vite :

```
publicImgDir = path.join(config.publicDir, 'img')
distImgDir   = path.resolve(config.root, config.build.outDir, 'img')
```

Le plugin respecte ainsi les valeurs personnalisées de `publicDir` ou `build.outDir` définies dans votre config Vite, sans nécessiter de configuration supplémentaire.
