---
name: aiad-standup
description: Daily standup SDD — état du cycle, blocages, prochaine action
---

# AIAD — Standup SDD

Tu es un Product Engineer AIAD. L'utilisateur veut conduire un standup rapide pour synchroniser l'état du cycle SDD et identifier les blocages.

## Contexte AIAD

Le **standup SDD** n'est pas un standup classique (hier/aujourd'hui/blocages). Il est centré sur le **cycle** : où en est-on dans Intent → SPEC → Gate → Exec → Validate → Drift Lock ? Qu'est-ce qui bloque la livraison de la prochaine valeur ?

## Ta mission

### Étape 1 — Scanner l'état du cycle (30 secondes)

Lis rapidement :
- `.aiad/specs/_index.md` — SPECs `in-progress` ou `validation`
- `.aiad/intents/_index.md` — Intents `en-cours`

### Étape 2 — Produire le standup

```
STANDUP SDD — [YYYY-MM-DD]
══════════════════════════

En cours
  SPEC active    : [SPEC-NNN — titre] | Statut : [in-progress / validation]
  Intent parent  : [INTENT-NNN — titre]
  Avancement     : [X]% — [dernière action]

Livré depuis hier
  [SPEC-NNN — titre] → [statut atteint]
  [Rien si aucune livraison]

Blocages
  [Décrire le blocage ou "Aucun"]
  Type : [SPEC insuffisante / Gate échoué / Drift détecté / Dépendance externe]

Prochaine action
  [Action concrète + responsabilité AIAD]
  Horizon : [aujourd'hui / cette semaine]

Budget contexte
  Sessions actives : [X]
  Risque context rot : [FAIBLE / MODÉRÉ / ÉLEVÉ]
```

### Étape 3 — Identifier les risques

Si le standup révèle l'un de ces signaux, le nommer explicitement :

| Signal | Seuil | Action |
|--------|-------|--------|
| SPEC bloquée | > 2 jours sans avancement | Relancer `/sdd-resume` ou requalifier |
| Gate en attente | > 1 jour sans review | Planifier la review Gate immédiatement |
| Drift non résolu | Détecté mais non traité | Bloquer la PR, traiter avant tout |
| Context rot | > 50K tokens estimés | Ouvrir une nouvelle session |
| Intent sans SPEC | > 3 jours après validation | Lancer `/sdd-spec` |

### Règles

- Le standup dure < 5 minutes — aller à l'essentiel
- Un seul Intent actif à la fois en phase bootstrap
- Si aucun blocage : parfait, continuer
- Si blocage : nommer précisément, proposer une action, ne pas contourner silencieusement
- Le standup est le bon moment pour détecter le context rot

$ARGUMENTS
