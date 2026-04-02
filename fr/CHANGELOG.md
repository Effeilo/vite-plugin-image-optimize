[EN](../CHANGELOG.md) | **FR**

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# 📦 Journal des modifications

Tous les changements notables de ce projet sont documentés dans ce fichier.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)  
et ce projet respecte le [versionnage sémantique](https://semver.org/lang/fr/).

---

<br>

## [2.0.1] – 2026-04-02

### 🐛 Corrigé

- **Erreur de verrouillage de fichier sous Windows lors du post-build :** `sharp(file)` gardait un descripteur de fichier natif ouvert sous Windows, provoquant une erreur `UNKNOWN` quand `fs.writeFile` tentait d'ouvrir le même fichier en écriture. Corrigé en passant le buffer déjà chargé (`sharp(original)`) au lieu du chemin du fichier, afin que sharp ne conserve aucun verrou sur le fichier de sortie.

<br>

---

<br>

## [2.0.0] – 2026-03-29

### ⚠️ Changements majeurs (breaking)

- **Moteur remplacé :** `imagemin` et tous ses plugins (`imagemin-mozjpeg`, `imagemin-pngquant`, `imagemin-svgo`, `imagemin-webp`) sont supprimés au profit de [`sharp`](https://sharp.pixelplumbing.com/) et [`svgo`](https://svgo.dev/). Requiert Node.js ≥ 18.17.0.
- **Type de `pngQuality` modifié :** était `[number, number]` (min/max pngquant), devient un `number` simple (0–100), cohérent avec l'API de sharp.
- **Option `webpFormats` supprimée :** le plugin cible toujours `.jpg`, `.jpeg` et `.png` pour la génération des formats modernes.
- **`webpExclude` renommé en `exclude` :** s'applique désormais uniformément aux deux phases (pré-build et post-build).

### ✨ Ajouté

- **Génération AVIF :** nouvelles options `avifEnable` (défaut : `true`) et `avifQuality` (défaut : `50`). Le plugin génère maintenant `.avif` et `.webp` depuis chaque JPEG/PNG source.
- **Pré-build incrémental :** les fichiers de sortie (`.avif`, `.webp`) sont ignorés s'ils existent déjà et sont plus récents que leur source — plus de ré-encodage inutile sur les builds successifs.
- **Traitement parallèle :** la génération pré-build et la compression post-build sont entièrement parallélisées avec `Promise.all` pour des builds plus rapides sur les gros projets.
- **Résolution de chemins précise :** un hook `configResolved` lit désormais `config.publicDir` et `config.build.outDir` depuis Vite, au lieu de se baser sur des chemins hardcodés (`public/img`, `dist/img`) relatifs à `process.cwd()`.
- **Build uniquement :** `apply: 'build'` garantit que les hooks du plugin ne s'enregistrent jamais dans le serveur de dev Vite.
- **Compression AVIF en post-build :** la phase `closeBundle` compresse désormais aussi les fichiers `.avif` dans `dist/img`.
- **Suite de tests :** tests d'intégration et tests unitaires avec [Vitest](https://vitest.dev/). Lancer avec `npm test`.
- **Résolution NodeNext :** `tsconfig.json` utilise maintenant `moduleResolution: "NodeNext"`, supprimant le besoin du script `fix-extensions.js` en post-build.

### 🐛 Corrigé

- Les fichiers `.jpg` n'étaient jamais convertis en WebP à cause d'un mismatch d'extension (`.jpg` vs `jpg`) dans la config par défaut de `webpFormats`.
- Les fichiers `.webp` générés dans `public/img/` étaient recompressés à chaque build, entraînant une dégradation progressive par compression lossy cumulative.
- `closeBundle` pouvait s'exécuter en mode dev/watch si `dist/img` existait, risquant de corrompre les assets sources.
- Division par zéro lors du calcul des économies totales quand aucune image n'était trouvée.
- Le nom du plugin utilisait le préfixe `vite:`, réservé aux plugins internes de Vite. Renommé `image-optimize`.

### 🔄 Modifié

- Script `build` simplifié en `"tsc"` — `scripts/fix-extensions.js` n'est plus nécessaire.
- Version minimale de Node.js portée à `18.17.0` (requis par sharp).

<br>

---

<br>

## [1.0.0] – 2025-07-21

### ✨ Ajouté

- Première version de `vite-plugin-image-optimize`
- Génération automatique des fichiers `.webp` à partir des `.jpg` et `.png` dans `public/img`
- Optimisation post-build de toutes les images dans `dist/img` (`.jpg`, `.png`, `.svg`, `.webp`)
- Options configurables :
  - Qualité de compression JPEG / PNG / WebP
  - Activation ou non de la génération WebP
  - Limitation de WebP à certaines extensions (`.png`, `.jpg`, etc.)
  - Exclusion de fichiers via des patterns glob
  - Affichage détaillé des fichiers traités et des économies de taille

<br>

---