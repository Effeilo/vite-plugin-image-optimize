**EN** | [FR](./fr/CHANGELOG.md)

<div>
  <img src="https://browserux.com/img/logos/logo-browserux-image-optimize-300.png" alt="logo vite-plugin-image-optimize"/>
</div>

# 📦 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com)  
and this project adheres to [Semantic Versioning](https://semver.org).

---

<br>

## [1.0.0] – 2025-07-21

### ✨ Added

- Initial release of `vite-plugin-image-optimize`
- Automatic `.webp` generation from `.jpg` and `.png` files inside `public/img`
- Post-build optimization of all image files in `dist/img` (`.jpg`, `.png`, `.svg`, `.webp`)
- Configurable options:
  - JPEG / PNG / WebP compression quality
  - Enable or disable WebP generation
  - Limit WebP to specific extensions (`.png`, `.jpg`, etc.)
  - Exclude files using glob patterns
  - Verbose logging for processed files and size savings

<br>

---