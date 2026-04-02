# Hooks

`vite-plugin-image-optimize` implémente trois hooks de plugin Vite/Rollup. Cette page documente ce que fait chaque hook et quand il s'exécute.

---

## Vue d'ensemble

| Hook | Phase | Type | Rôle |
|---|---|---|---|
| `configResolved` | Config | Sync | Résoudre `publicImgDir` et `distImgDir` depuis la config Vite |
| `buildStart` | Pré-build | Async | Générer `.webp` et `.avif` depuis JPEG/PNG dans `public/img` |
| `closeBundle` | Post-build | Async | Compresser toutes les images dans `dist/img` en place |

Le plugin déclare également `apply: 'build'`, ce qui empêche tous les hooks de s'enregistrer pendant `vite dev` ou `vite preview`.

---

## `configResolved`

**Type :** Sync
**S'exécute :** Une fois, après que Vite ait résolu et fusionné toute la configuration.

```ts
configResolved(config: ResolvedConfig) {
  publicImgDir = path.join(config.publicDir, 'img')
  distImgDir = path.resolve(config.root, config.build.outDir, 'img')
}
```

Lit `config.publicDir` et `config.build.outDir` depuis la configuration résolue de Vite et les stocke comme répertoires source et cible pour les hooks suivants.

Cette approche est plus fiable que d'utiliser `process.cwd()` directement : elle respecte les valeurs personnalisées de `publicDir` ou `build.outDir` définies dans la config Vite du projet.

---

## `buildStart`

**Type :** Async
**S'exécute :** Une fois, avant que Vite commence à traiter les modules.

Génère des versions `.webp` et/ou `.avif` des fichiers JPEG et PNG trouvés dans `<publicDir>/img/`.

### Comportement

1. Si `webpEnable` et `avifEnable` sont tous les deux à `false`, le hook retourne immédiatement.
2. Si `<publicDir>/img/` n'existe pas, le hook retourne silencieusement.
3. Tous les fichiers JPEG et PNG sont collectés via `getAllImages`.
4. Pour chaque fichier source, des versions WebP et/ou AVIF sont générées avec `sharp`.
5. Chaque fichier de sortie est vérifié avec `fileIsNewer` - si la sortie existe déjà et est plus récente que la source, la conversion est ignorée.
6. Toutes les conversions s'exécutent en parallèle avec `Promise.all`.
7. Les résultats sont affichés dans le terminal.

### Emplacement de la sortie

Les fichiers générés sont écrits à côté des fichiers sources dans `<publicDir>/img/`. Vite copie ensuite l'intégralité du répertoire `public/` vers `dist/` via son propre pipeline d'assets.

```
public/img/
├── logo.png           (source)
├── logo.webp          (généré par buildStart)
├── logo.avif          (généré par buildStart)
```

---

## `closeBundle`

**Type :** Async
**S'exécute :** Une fois, après que Vite ait écrit tous les fichiers de sortie sur le disque.

Compresse toutes les images dans `<outDir>/img/` en place en utilisant [sharp](https://sharp.pixelplumbing.com/) et [svgo](https://svgo.dev/).

### Comportement

1. Si `<outDir>/img/` n'existe pas, le hook retourne silencieusement.
2. Tous les fichiers image sont collectés via `getAllImages` (`.jpg`, `.jpeg`, `.png`, `.svg`, `.webp`, `.avif`).
3. Pour chaque fichier :
   - Le contenu est lu en mémoire avec `fs.readFile`.
   - Le buffer est passé à `sharp(buffer)` (et non `sharp(filePath)`) pour éviter le verrouillage de fichiers sous Windows.
   - La sortie compressée est réécrite au même chemin avec `fs.writeFile`.
4. Les fichiers SVG sont optimisés avec `svgoOptimize` et `multipass: true`.
5. Toutes les compressions s'exécutent en parallèle avec `Promise.all`.
6. Un rapport par fichier et un résumé des économies totales sont affichés dans le terminal.

### Pourquoi `sharp(buffer)` et non `sharp(filePath)`

Sous Windows, passer un chemin de fichier à `sharp()` garde un descripteur natif ouvert jusqu'à ce que l'instance sharp soit collectée par le garbage collector. Quand `fs.writeFile` tente ensuite d'ouvrir le même fichier en écriture, il rencontre un fichier verrouillé et lève une erreur `UNKNOWN`. Utiliser le buffer déjà chargé évite entièrement ce problème.

### Réglages par format

| Extension | Encodeur | Réglages |
|---|---|---|
| `.jpg` / `.jpeg` | sharp JPEG | `quality`, `mozjpeg: true` |
| `.png` | sharp PNG | `quality`, `compressionLevel: 9` |
| `.webp` | sharp WebP | `quality` |
| `.avif` | sharp AVIF | `quality` |
| `.svg` | svgo | `multipass: true` |
