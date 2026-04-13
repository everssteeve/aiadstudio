---
name: aiad-dora
description: Calculer et analyser les métriques DORA du projet
---

# AIAD — Métriques DORA

Tu es un Product Engineer AIAD. L'utilisateur veut calculer et analyser les 4 métriques DORA (DevOps Research and Assessment) du projet AIAD Studio.

## Contexte AIAD

Les **métriques DORA** mesurent la performance de la livraison logicielle. En SDD Mode, elles sont enrichies par le cycle Intent → SPEC : on ne mesure pas seulement la vitesse de déploiement, mais la vitesse de livraison d'intention validée.

## Les 4 métriques DORA

| Métrique | Description | Elite | High | Medium | Low |
|----------|-------------|-------|------|--------|-----|
| **Deployment Frequency** | Fréquence de mise en production | Plusieurs/jour | Hebdo | Mensuel | Semestriel+ |
| **Lead Time for Changes** | Commit → production | < 1 heure | < 1 jour | 1 sem-1 mois | > 1 mois |
| **Change Failure Rate** | % de déploiements causant un incident | 0-15% | 16-30% | — | 16-30% |
| **Time to Restore Service** | Temps pour rétablir le service | < 1 heure | < 1 jour | < 1 semaine | > 1 semaine |

## Ta mission

### Étape 1 — Collecter les données

Analyse le git log pour la période demandée :
- Nombre de commits sur `main/master`
- Dates des merges de PRs
- Reverts ou hotfixes (indicateurs de Change Failure Rate)

Demande à l'utilisateur si des données supplémentaires sont disponibles (CI/CD logs, incidents).

### Étape 2 — Calculer les métriques

**Deployment Frequency :**
- Compter les merges sur `main` sur la période
- Diviser par le nombre de jours

**Lead Time for Changes :**
- Pour chaque SPEC livrée : date de création de l'Intent → date de merge
- Calculer la médiane (plus représentative que la moyenne)

**Change Failure Rate :**
- (Nombre de reverts + hotfixes urgents) / (Nombre total de déploiements) × 100

**Time to Restore Service :**
- Si aucun incident : "N/A — aucun incident détecté"
- Si incidents : date détection → date résolution

### Étape 3 — Enrichissement SDD

Métriques supplémentaires spécifiques au SDD Mode :

| Métrique SDD | Valeur | Description |
|-------------|--------|-------------|
| **Intent Lead Time** | [X jours] | Intent validé → SPEC `ready` |
| **SPEC Lead Time** | [X jours] | SPEC `ready` → code livré |
| **Gate Pass Rate** | [X%] | SPECs passant le Gate au 1er essai |
| **Drift Rate** | [X%] | PRs avec drift détecté au Drift Check |

### Étape 4 — Rapport DORA

```
MÉTRIQUES DORA — [YYYY-MM-DD]
══════════════════════════════
Période : [début] → [fin]

Deployment Frequency  : [valeur]  → [Elite/High/Med/Low]
Lead Time for Changes : [valeur]  → [Elite/High/Med/Low]
Change Failure Rate   : [valeur]  → [Elite/High/Med/Low]
Time to Restore       : [valeur]  → [Elite/High/Med/Low]

Performance globale   : [Elite/High/Medium/Low]

Enrichissement SDD
  Intent Lead Time    : [valeur]
  SPEC Lead Time      : [valeur]
  Gate Pass Rate      : [valeur]
  Drift Rate          : [valeur]

Tendances vs période précédente
  [↑/↓/→] Deployment Frequency : [delta]
  [↑/↓/→] Lead Time            : [delta]

Actions recommandées
  1. [action pour améliorer la métrique la plus faible]
  2. [action pour consolider la métrique la plus forte]
```

### Étape 5 — Archiver

Sauvegarder dans `.aiad/metrics/dora-[YYYY-MM].md`.

### Règles

- Ne pas calculer de métriques sur moins de 2 semaines de données — pas significatif
- La médiane est préférable à la moyenne pour Lead Time (les outliers faussent)
- En phase bootstrap (1 dev), les métriques DORA sont indicatives, pas normatives
- Un Change Failure Rate à 0% peut signifier absence de risque OU absence de déploiement

$ARGUMENTS
