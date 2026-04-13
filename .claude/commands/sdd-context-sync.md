---
name: sdd-context-sync
description: Synchroniser le Context Mesh après validation humaine (Context Sync Loop)
---

# SDD Mode — Context Sync Loop

Tu es un Product Engineer AIAD. L'utilisateur veut synchroniser le Context Mesh avec les évolutions récentes du projet (code, artefacts, décisions).

## Contexte SDD Mode

Le **Context Sync Loop** est le processus par lequel les évolutions de contexte (nouveaux patterns, décisions d'architecture, leçons apprises) sont propagées dans le Context Mesh après validation humaine explicite. **Aucune propagation ne se fait sans validation humaine** — c'est une règle absolue.

## Ta mission

### Étape 1 — Identifier les évolutions à synchroniser

Identifie ce qui a changé depuis la dernière synchronisation :

| Source | Évolution | Scope cible | Propagé ? |
|--------|-----------|-------------|-----------|
| AGENT-GUIDE.md | Nouvelles règles TOUJOURS/JAMAIS | Project | NON |
| ARCHITECTURE.md | Nouveaux patterns ou ADRs | Project | NON |
| Rétro | Lessons Learned / Human Learnings | Project | NON |
| SPEC livrée | Nouveaux patterns de code | Project | NON |
| Décision PE | Changement de convention | Project | NON |

### Étape 2 — Préparer les mises à jour

Pour chaque évolution identifiée, prépare le contenu à synchroniser dans `.aiad/context/` :

- **`context/CONTEXT.md`** — Vue d'ensemble du contexte projet
- **`context/skills/`** — Patterns et compétences techniques découverts
- **`context/rules/`** — Nouvelles règles ou conventions validées
- **`context/decisions/`** — Décisions structurantes (si pas déjà en ADR)

Présente les mises à jour proposées AVANT d'écrire quoi que ce soit.

### Étape 3 — Validation humaine obligatoire

Pour chaque mise à jour proposée :

```
PROPOSITION DE SYNC CONTEXTE
─────────────────────────────
Scope     : [Organization / Team / Project / Personal]
Fichier   : [chemin]
Type      : [Ajout / Modification / Suppression]
Contenu   : [texte exact]

Valider ? [OUI / NON / MODIFIER]
```

**Ne jamais écrire sans validation explicite.**

### Étape 4 — Appliquer les synchronisations validées

Pour chaque élément validé :
1. Mettre à jour le fichier cible dans `.aiad/context/`
2. Ajouter une entrée dans `CHANGELOG-ARTEFACTS.md`
3. Si le changement touche AGENT-GUIDE ou ARCHITECTURE, vérifier la cohérence avec CLAUDE.md

### Étape 5 — Rapport de synchronisation

```
CONTEXT SYNC LOOP — Rapport
════════════════════════════
Date : [YYYY-MM-DD]

Évolutions identifiées  : [X]
Évolutions validées     : [X]
Évolutions rejetées     : [X]
Fichiers mis à jour     : [liste]
```

### Règles

- La propagation de contexte est TOUJOURS soumise à validation humaine
- Un contexte non validé n'est pas du contexte — c'est du bruit
- Préférer des mises à jour atomiques (une idée par fichier) à des mises à jour massives
- Le Context Mesh est du code versionné — chaque sync passe par un commit

$ARGUMENTS
