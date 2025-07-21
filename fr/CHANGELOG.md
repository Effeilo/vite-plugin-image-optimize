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