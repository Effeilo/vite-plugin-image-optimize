# Utilisation HTML

Une fois que le plugin a généré les versions `.avif` et `.webp` de vos images, vous devez les référencer correctement en HTML pour que chaque navigateur reçoive le format le plus efficace qu'il supporte.

---

## L'élément `<picture>`

La méthode standard pour servir plusieurs formats d'image avec un fallback est l'élément `<picture>` :

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description de l'image">
</picture>
```

Le navigateur évalue les éléments `<source>` dans l'ordre et choisit le premier format qu'il supporte. L'élément `<img>` sert de fallback universel.

> Incluez toujours l'attribut `alt` sur l'élément `<img>`. Il est requis pour l'accessibilité.

---

## Priorité des formats

| Priorité | Format | Raison |
|---|---|---|
| 1er | AVIF | Meilleure compression, navigateurs modernes |
| 2e | WebP | Bonne compression, large support |
| 3e | JPEG/PNG | Fallback universel |

L'AVIF produit typiquement des fichiers 40 à 60 % plus légers que le JPEG à qualité équivalente. Le WebP produit des fichiers 25 à 35 % plus légers. Servir l'AVIF en premier maximise les performances pour les utilisateurs sur navigateurs modernes, tandis que les anciens navigateurs se replient gracieusement.

---

## Avec des images responsives

Combinez `<picture>` avec `srcset` et `sizes` pour les mises en page responsives :

```html
<picture>
  <source
    srcset="image-400.avif 400w, image-800.avif 800w"
    sizes="(max-width: 600px) 400px, 800px"
    type="image/avif"
  >
  <source
    srcset="image-400.webp 400w, image-800.webp 800w"
    sizes="(max-width: 600px) 400px, 800px"
    type="image/webp"
  >
  <img
    src="image-800.jpg"
    srcset="image-400.jpg 400w, image-800.jpg 800w"
    sizes="(max-width: 600px) 400px, 800px"
    alt="Description de l'image"
    width="800"
    height="600"
  >
</picture>
```

> `vite-plugin-image-optimize` ne génère pas de multiples tailles de la même image. Les variantes `srcset` responsives doivent être créées séparément si nécessaire.

---

## Avec le lazy loading

Ajoutez `loading="lazy"` pour différer le chargement des images hors écran :

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="..." loading="lazy" width="800" height="600">
</picture>
```

> Spécifiez toujours les attributs `width` et `height` sur `<img>` pour éviter les décalages de mise en page (CLS).

---

## Images au-dessus de la ligne de flottaison

Pour les images visibles au chargement initial (images hero, logos), utilisez `loading="eager"` et envisagez d'ajouter un hint `fetchpriority="high"` :

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img
    src="hero.jpg"
    alt="..."
    loading="eager"
    fetchpriority="high"
    width="1200"
    height="600"
  >
</picture>
```

---

## Support navigateur des formats d'image

| Format | Chrome | Firefox | Safari | Edge |
|---|---|---|---|---|
| WebP | 32+ | 65+ | 14+ | 18+ |
| AVIF | 85+ | 93+ | 16.1+ | 121+ |
| JPEG | Tous | Tous | Tous | Tous |
| PNG | Tous | Tous | Tous | Tous |
| SVG | Tous | Tous | Tous | Tous |

L'AVIF bénéficie d'une bonne couverture sur les navigateurs 2024+. Pour une compatibilité maximale, incluez toujours un fallback JPEG ou PNG dans votre élément `<picture>`.
