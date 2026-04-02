# Contribuer

Les contributions sont les bienvenues. Que vous souhaitiez signaler un bug, proposer une amélioration, ajouter une fonctionnalité ou corriger une faute de frappe, n'hésitez pas à participer.

---

## Signaler un problème

Ouvrez une issue sur le dépôt GitHub pour :

- Signaler un bug ou un comportement inattendu.
- Proposer une amélioration ou une nouvelle fonctionnalité.
- Discuter d'une idée avant de soumettre une pull request.

Lors d'un signalement de bug, incluez :

- Votre version de Node.js (`node -v`)
- Votre version de Vite (`npm list vite`)
- Votre système d'exploitation
- Le message d'erreur et la stack trace si applicable
- Une reproduction minimale si possible

---

## Soumettre une pull request

1. Forkez le dépôt.
2. Créez une branche dédiée :

```bash
git checkout -b ma-proposition
```

3. Effectuez vos modifications.
4. Lancez la suite de tests :

```bash
npm test
```

5. Commitez avec un message clair :

```bash
git commit -m "Fix: description du changement"
```

6. Poussez la branche :

```bash
git push origin ma-proposition
```

7. Ouvrez une pull request sur GitHub.

---

## Lancer en local

```bash
# Installer les dépendances
npm install

# Compiler le plugin
npm run build

# Mode watch pendant le développement
npm run watch

# Lancer les tests
npm test

# Lancer les tests en mode watch
npm run test:watch
```

---

## Bonnes pratiques

- Restez fidèle au périmètre concentré du plugin : génération et compression d'images pendant `vite build`.
- Ne changez que ce qui est nécessaire. Les modifications ciblées sont plus faciles à relire.
- Ajoutez ou mettez à jour les tests pour tout comportement que vous modifiez.
- Testez vos modifications sur macOS ou Linux, et sur Windows si le changement touche aux opérations système de fichiers.
- Consultez le [changelog](../../CHANGELOG.md) pour comprendre l'historique des décisions.

---

## Structure du projet

```
├── dist/                  sortie compilée (générée par tsc)
├── src/
│   ├── index.ts           point d'entrée du plugin et hooks Vite
│   ├── types.ts           interface ImageOptimizeOptions
│   ├── utils.ts           getAllImages, fileIsNewer, formatSize
│   └── types/
│       └── shims.d.ts     déclarations de types de modules
├── tests/                 suite de tests Vitest
├── docs/                  cette documentation
├── scripts/
│   └── fix-extensions.js  script legacy (plus utilisé)
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## Crédits

`vite-plugin-image-optimize` est construit sur :

- [sharp](https://sharp.pixelplumbing.com/) par Lovell Fuller - traitement d'images haute performance
- [svgo](https://svgo.dev/) - optimisation SVG
- [globby](https://github.com/sindresorhus/globby) par Sindre Sorhus - scan du système de fichiers avec glob
