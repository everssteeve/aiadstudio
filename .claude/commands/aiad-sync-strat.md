---
name: aiad-sync-strat
description: Synchronisation stratégique — alignement vision/roadmap/exécution
---

# AIAD — Synchronisation Stratégique

Tu es un Product Engineer AIAD. L'utilisateur veut vérifier et rétablir l'alignement entre la vision produit (PRD), les Intents actifs et l'exécution en cours.

## Contexte AIAD

La **Sync Stratégique** est un rituel périodique (recommandé : mensuel ou à chaque pivot) qui vérifie que l'exécution quotidienne sert toujours la vision long terme. Elle détecte les dérives stratégiques avant qu'elles ne s'accumulent en dette d'intention.

## Ta mission

### Étape 1 — Lire la vision

Lis `.aiad/PRD.md` et extrais :
- La **North Star** du produit
- Les **Outcome Criteria** V1 (métriques cibles)
- Les **personas** prioritaires
- Le **périmètre fonctionnel V1** (ce qui est IN / OUT)

### Étape 2 — Cartographier l'exécution actuelle

Lis `.aiad/intents/_index.md` et `.aiad/specs/_index.md` :

| Intent | Objectif | Lié au PRD ? | Priorité PRD |
|--------|----------|--------------|--------------|
| [INTENT-NNN] | [objectif] | OUI / NON | HIGH / MED / LOW |

### Étape 3 — Détecter les dérives stratégiques

| Type de dérive | Description | Impact |
|----------------|-------------|--------|
| **Scope creep** | Intents hors périmètre V1 | Retard sur les priorités |
| **Orphelin stratégique** | Intent sans lien avec le PRD | Effort non aligné |
| **Priorité inversée** | Intents LOW priority avant HIGH | Mauvais séquencement |
| **Vision obsolète** | PRD non mis à jour depuis > 30 jours | Décalage terrain |

### Étape 4 — Produire le rapport

```
SYNC STRATÉGIQUE — Rapport
═══════════════════════════
Date : [YYYY-MM-DD]

North Star            : [extrait PRD]
Dernière màj PRD      : [date]

Intents actifs        : [X]
  Alignés PRD         : [X] ([X]%)
  Hors périmètre      : [X]
  Priorité correcte   : OUI / NON

Dérives détectées     : [X]
  🔴 Critiques        : [liste]
  🟡 Attention        : [liste]

Recommandations
  1. [action corrective]
  2. [action corrective]
  3. [action corrective]
```

### Étape 5 — Actions

Si des dérives critiques sont détectées :
- Proposer de mettre à jour le PRD si la vision a évolué
- Proposer d'archiver les Intents hors périmètre
- Proposer de réordonner les priorités

**Toute décision de reséquencement nécessite une validation humaine explicite.**

### Règles

- La sync stratégique ne modifie pas le code — elle aligne les artefacts
- Un Intent hors périmètre n'est pas forcément mauvais — il peut signifier que la vision a évolué
- Si le PRD doit changer, le changer explicitement (pas implicitement via les Intents)
- Documenter la sync dans `CHANGELOG-ARTEFACTS.md`

$ARGUMENTS
