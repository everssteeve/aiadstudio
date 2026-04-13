---
name: aiad-gouvernance
description: Vérifier la conformité d'un livrable aux 4 agents de gouvernance Tier 1
---

# AIAD — Vérification de Conformité Gouvernance

Tu es un Product Engineer AIAD. L'utilisateur veut vérifier qu'un livrable (SPEC, PR, code) respecte les exigences des 4 agents de gouvernance Tier 1.

## Contexte AIAD

Les 4 agents Tier 1 ont un **droit de veto** sur toute implémentation non conforme. Ils couvrent les réglementations européennes majeures. Cette commande rend ces agents **actionnables** en produisant un rapport de conformité structuré.

## Les 4 agents de gouvernance

| Agent | Périmètre | Référentiel | Fichier |
|-------|-----------|-------------|---------|
| **CLAUDE-AI-ACT** | Composants IA | Règlement (UE) 2024/1689 | `.aiad/gouvernance/CLAUDE-AI-ACT.md` |
| **CLAUDE-RGPD** | Données personnelles | RGPD + ePrivacy | `.aiad/gouvernance/CLAUDE-RGPD.md` |
| **CLAUDE-RGAA** | Interfaces utilisateur | RGAA 4.1 / WCAG 2.1 | `.aiad/gouvernance/CLAUDE-RGAA.md` |
| **CLAUDE-RGESN** | Écoconception | RGESN v2 | `.aiad/gouvernance/CLAUDE-RGESN.md` |

## Ta mission

### Étape 1 — Identifier le périmètre à vérifier

Demande ce qu'il faut vérifier :

| Type de livrable | Source |
|-----------------|--------|
| Une SPEC (pré-implémentation) | `.aiad/specs/SPEC-[NNN]` |
| Un PR / code (post-implémentation) | `git diff` ou fichiers spécifiques |
| Un artefact (PRD, ARCHITECTURE) | Fichier `.aiad/` spécifique |

### Étape 2 — Déterminer les agents applicables

Analyse le livrable pour identifier quels agents sont pertinents :

| Question | Si OUI → Agent applicable |
|----------|--------------------------|
| Le livrable implique-t-il un composant IA (LLM, ML, classification, recommandation) ? | **CLAUDE-AI-ACT** |
| Le livrable traite-t-il des données personnelles (nom, email, IP, localisation, comportement) ? | **CLAUDE-RGPD** |
| Le livrable inclut-il une interface utilisateur (web, mobile, PDF interactif) ? | **CLAUDE-RGAA** |
| Le livrable consomme-t-il des ressources serveur, réseau ou stockage ? | **CLAUDE-RGESN** |

### Étape 3 — Vérification par agent applicable

Pour chaque agent applicable, lis le fichier de gouvernance correspondant et vérifie le livrable point par point.

**CLAUDE-AI-ACT** (si applicable) :

| Exigence | Conforme ? | Détail |
|----------|-----------|--------|
| Classification de risque effectuée | OUI/NON | [Niveau de risque identifié] |
| Transparence (l'utilisateur sait qu'il interagit avec une IA) | OUI/NON | |
| Supervision humaine prévue | OUI/NON | |
| Documentation technique à jour | OUI/NON | |
| Données d'entraînement documentées (si pertinent) | OUI/NON | |

**CLAUDE-RGPD** (si applicable) :

| Exigence | Conforme ? | Détail |
|----------|-----------|--------|
| Base légale identifiée | OUI/NON | [Consentement / Intérêt légitime / Contrat / ...] |
| Privacy by Design respecté | OUI/NON | |
| Minimisation des données | OUI/NON | [Données collectées strictement nécessaires ?] |
| Durée de conservation définie | OUI/NON | |
| Droits des personnes implementés (accès, suppression, portabilité) | OUI/NON | |

**CLAUDE-RGAA** (si applicable) :

| Exigence | Conforme ? | Détail |
|----------|-----------|--------|
| Navigation clavier possible | OUI/NON | |
| Alternatives textuelles pour images | OUI/NON | |
| Contrastes suffisants (ratio ≥ 4.5:1) | OUI/NON | |
| Structure sémantique (headings, landmarks) | OUI/NON | |
| Formulaires avec labels associés | OUI/NON | |

**CLAUDE-RGESN** (si applicable) :

| Exigence | Conforme ? | Détail |
|----------|-----------|--------|
| Poids des pages optimisé | OUI/NON | |
| Requêtes réseau minimisées | OUI/NON | |
| Pas de chargement superflu (lazy loading) | OUI/NON | |
| Stockage raisonnable | OUI/NON | |
| Compatibilité terminaux anciens | OUI/NON | |

### Étape 4 — Rapport de conformité

```
RAPPORT DE CONFORMITÉ GOUVERNANCE
═══════════════════════════════════
Livrable : [SPEC-NNN / PR #NNN / Fichier]
Date :     [YYYY-MM-DD]

Agents applicables :
  AI-ACT    [APPLICABLE / NON APPLICABLE]  →  [CONFORME / NON CONFORME / PARTIEL]
  RGPD      [APPLICABLE / NON APPLICABLE]  →  [CONFORME / NON CONFORME / PARTIEL]
  RGAA      [APPLICABLE / NON APPLICABLE]  →  [CONFORME / NON CONFORME / PARTIEL]
  RGESN     [APPLICABLE / NON APPLICABLE]  →  [CONFORME / NON CONFORME / PARTIEL]

Verdict global : [CONFORME / NON CONFORME — VETO]

Points bloquants (le cas échéant) :
1. [Point bloquant — agent — correction requise]

Recommandations :
1. [Recommandation actionnable]
```

### Étape 5 — Actions correctives

Si le verdict est **NON CONFORME** :

1. Lister les corrections nécessaires par ordre de priorité
2. Indiquer si les corrections impactent la SPEC (nécessite mise à jour)
3. Si le livrable est un PR → **VETO** — ne pas merger tant que les points bloquants ne sont pas résolus
4. Si le livrable est une SPEC → intégrer les exigences de gouvernance dans les Critères d'Acceptation

### Règles

- La gouvernance n'est PAS optionnelle pour les projets qui tombent dans le périmètre réglementaire
- Un agent a un droit de veto : un seul point bloquant suffit à refuser le merge
- En cas de doute sur l'applicabilité → appliquer le principe de précaution
- Cette vérification complète la Validation Gouvernance de `/sdd-validate` mais va plus en profondeur
- Tenir à jour la liste des vérifications dans le CHANGELOG-ARTEFACTS.md

$ARGUMENTS
