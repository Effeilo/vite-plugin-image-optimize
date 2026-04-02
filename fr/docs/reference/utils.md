# Utilitaires

`vite-plugin-image-optimize` expose trois fonctions utilitaires internes dans `src/utils.ts`. Elles sont utilisées par les hooks du plugin mais ne font pas partie de l'API publique.

---

## `getAllImages`

```ts
function getAllImages(
  root: string,
  exts: string[],
  exclude: string[] = []
): Promise<string[]>
```

Collecte récursivement tous les fichiers image correspondant aux extensions fournies dans un répertoire donné, en respectant les patterns d'exclusion.

### Paramètres

| Paramètre | Type | Description |
|---|---|---|
| `root` | `string` | Répertoire racine à scanner |
| `exts` | `string[]` | Extensions de fichiers à inclure (ex. `['.jpg', '.png']`) |
| `exclude` | `string[]` | Patterns glob optionnels à exclure (par défaut : `[]`) |

### Valeur de retour

Une promesse qui se résout en un tableau de chemins de fichiers absolus.

### Fonctionnement

Utilise en interne [globby](https://github.com/sindresorhus/globby) avec `absolute: true` et l'option `ignore` renseignée avec le tableau `exclude`. Les extensions sont normalisées en supprimant le point initial avant de construire le pattern glob :

```ts
const patterns = [`**/*.{${exts.map(e => e.replace('.', '')).join(',')}}`]
```

### Exemple

```ts
const images = await getAllImages('/public/img', ['.jpg', '.png'], ['**/og-*.png'])
// → ['/public/img/logo.png', '/public/img/banner.jpg']
```

---

## `fileIsNewer`

```ts
function fileIsNewer(src: string, dest: string): Promise<boolean>
```

Retourne `true` si le fichier source est plus récent que le fichier de destination, ou si le fichier de destination n'existe pas. Utilisé pour éviter de régénérer des fichiers WebP et AVIF déjà à jour.

### Paramètres

| Paramètre | Type | Description |
|---|---|---|
| `src` | `string` | Chemin du fichier source |
| `dest` | `string` | Chemin du fichier de sortie |

### Valeur de retour

Une promesse qui se résout en un booléen.

### Fonctionnement

Compare `mtimeMs` (horodatage de dernière modification en millisecondes) des deux fichiers avec `fs.stat`. Si la destination n'existe pas, `fs.stat` lève une exception et la fonction retourne `true` (le fichier doit être généré).

```ts
const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)])
return srcStat.mtimeMs > destStat.mtimeMs
```

### Exemple

```ts
const needsUpdate = await fileIsNewer('/public/img/logo.png', '/public/img/logo.webp')
// → true si logo.png a été modifié après la création de logo.webp
// → true si logo.webp n'existe pas encore
// → false si logo.webp est déjà à jour
```

---

## `formatSize`

```ts
function formatSize(bytes: number): string
```

Convertit une taille de fichier en octets en une chaîne lisible en kilooctets.

### Paramètres

| Paramètre | Type | Description |
|---|---|---|
| `bytes` | `number` | Taille en octets |

### Valeur de retour

Une chaîne formatée sous la forme `"X.X KB"` (une décimale).

### Exemple

```ts
formatSize(45056)   // → "44.0 KB"
formatSize(1150976) // → "1124.0 KB"
```

> Cette fonction est utilisée dans la sortie terminal pour afficher les tailles de fichiers avant et après compression.
