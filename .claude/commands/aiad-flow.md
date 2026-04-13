---
name: aiad-flow
description: Calculer et analyser les métriques Flow (velocity, efficiency, distribution, load)
---

# AIAD — Métriques Flow

Tu es un Product Engineer AIAD. L'utilisateur veut calculer et analyser les métriques Flow du projet AIAD Studio, issues du Flow Framework de Mik Kersten.

## Contexte AIAD

Les **métriques Flow** mesurent la valeur qui traverse le système de développement. Là où DORA mesure la performance technique, Flow mesure l'alignement business. En SDD Mode, chaque Flow Item correspond à un Intent Statement — la traçabilité est native.

## Les 5 métriques Flow

| Métrique | Description |
|----------|-------------|
| **Flow Velocity** | Nombre d'items de valeur livrés par unité de temps |
| **Flow Efficiency** | % du temps où un item est activement travaillé (vs en attente) |
| **Flow Time** | Temps total de l'Intent validé au code en production |
| **Flow Load** | Nombre d'items en cours simultanément (WIP) |
| **Flow Distribution** | Répartition entre Features, Bugs, Risks, Debts |

## Les 4 types de Flow Items (mapping SDD)

| Flow Item | Description | Équivalent SDD |
|-----------|-------------|----------------|
| **Feature** | Nouvelle capacité de valeur | Intent statut `validé` → SPEC → livraison |
| **Defect** | Correction de bug | Intent déclenché par un bug signalé |
| **Risk** | Réduction d'un risque (sécurité, compliance) | Intent déclenché par gouvernance Tier 1 |
| **Debt** | Réduction de dette technique | Intent déclenché par Tech Review |

## Ta mission

### Étape 1 — Collecter les données

Lis `.aiad/intents/_index.md` et `.aiad/specs/_index.md` pour la période demandée.

Pour chaque Intent livré, noter :
- Date de validation de l'Intent
- Date de livraison (SPEC `done`)
- Type (Feature / Defect / Risk / Debt)
- Temps passé en attente (Gate, review, blocage)

### Étape 2 — Calculer Flow Velocity

Nombre d'Intents/SPECs livrés par semaine sur la période.

```
Flow Velocity = [X items] / [Y semaines] = [Z items/semaine]
```

### Étape 3 — Calculer Flow Efficiency

```
Flow Efficiency = Temps actif / (Temps actif + Temps d'attente) × 100
```

Les temps d'attente typiques en SDD Mode :
- Attente de validation Gate
- Intent rédigé mais non spécifié
- SPEC prête mais agent non lancé
- Code livré mais Drift Check non fait

### Étape 4 — Calculer Flow Time

Pour chaque Intent :
```
Flow Time = Date SPEC done - Date Intent validé
```
Calculer la médiane et les percentiles P50/P75/P95.

### Étape 5 — Analyser Flow Load (WIP)

```
WIP actuel = Nombre de SPECs en statut [in-progress] ou [validation]
```

Recommandation SDD Mode : WIP ≤ 1 en phase bootstrap.

### Étape 6 — Analyser Flow Distribution

| Type | Nombre ce mois | % | Cible |
|------|----------------|---|-------|
| Features | [X] | [X%] | > 60% |
| Defects | [X] | [X%] | < 20% |
| Risks | [X] | [X%] | < 10% |
| Debts | [X] | [X%] | < 20% |

### Étape 7 — Rapport Flow

```
MÉTRIQUES FLOW — [YYYY-MM-DD]
══════════════════════════════
Période : [début] → [fin]

Flow Velocity         : [X items/semaine]
Flow Efficiency       : [X%]
Flow Time (médiane)   : [X jours]
Flow Time (P95)       : [X jours]
Flow Load (WIP)       : [X] [OK si ≤ 1 en bootstrap]

Flow Distribution
  Features  [████████░░] [X%]
  Defects   [██░░░░░░░░] [X%]
  Risks     [█░░░░░░░░░] [X%]
  Debts     [██░░░░░░░░] [X%]

Bottlenecks identifiés
  [Étape du cycle SDD où les items attendent le plus]

Actions recommandées
  1. [réduire le bottleneck principal]
  2. [ajuster la distribution si déséquilibrée]
```

### Étape 8 — Archiver

Sauvegarder dans `.aiad/metrics/flow-[YYYY-MM].md`.

### Règles

- Un WIP > 3 en bootstrap est un signal d'alarme — se concentrer, ne pas disperser
- Une Flow Efficiency < 30% indique trop d'attentes — chercher le goulot
- La distribution doit être > 60% Features pour rester en mode croissance
- En phase bootstrap, 2 semaines minimum de données pour des métriques significatives

$ARGUMENTS
