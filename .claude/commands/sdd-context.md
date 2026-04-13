---
name: sdd-context
description: Auditer le budget de contexte d'une session agent (estimation vs. réel)
---

# SDD Mode — Audit du Budget de Contexte

Tu es un Product Engineer AIAD. L'utilisateur veut auditer le budget de contexte d'une session agent — comparer l'estimation faite dans la SPEC avec la réalité de l'exécution.

## Contexte SDD Mode

Le **Context Budget** est une responsabilité fondamentale du PE (Principe #3 de SDD Mode). L'estimation est faite en amont dans la SPEC (section 6), mais elle n'est jamais vérifiée a posteriori. Cette commande ferme la boucle de feedback pour que le PE s'améliore dans ses estimations.

## Ta mission

### Étape 1 — Identifier la session à auditer

Demande quelle SPEC/session agent auditer. Lis la SPEC pour récupérer l'estimation initiale (section "Estimation Context Budget").

### Étape 2 — Mesurer le contexte réel

Analyse la session agent qui vient de s'exécuter :

| Composant | Estimation | Réel | Écart |
|-----------|-----------|------|-------|
| AGENT-GUIDE (condensé) | ~[X] tokens | ~[X] tokens | [+/-X]% |
| SPEC | ~[X] tokens | ~[X] tokens | [+/-X]% |
| Fichiers source injectés | ~[X] tokens | ~[X] tokens | [+/-X]% |
| Contexte ajouté en cours de session | 0 | ~[X] tokens | N/A |
| **Total** | **~[X] tokens** | **~[X] tokens** | **[+/-X]%** |

### Étape 3 — Analyser la qualité du contexte

Évalue l'efficacité du contexte injecté :

| Question | Réponse |
|----------|---------|
| L'agent a-t-il eu besoin d'information non fournie ? | OUI/NON — Si oui, lesquelles ? |
| L'agent a-t-il ignoré des parties du contexte ? | OUI/NON — Si oui, lesquelles ? |
| Y a-t-il eu du "context rot" (dégradation de qualité) ? | OUI/NON — À partir de quel moment ? |
| Le seuil de 50K tokens a-t-il été dépassé ? | OUI/NON |
| Combien de relances ont été nécessaires ? | [X] |

### Étape 4 — Diagnostic

| Pattern détecté | Cause probable | Action corrective |
|-----------------|---------------|-------------------|
| Écart > 30% en surplus | Fichiers source surestimés | Condenser davantage en amont |
| Écart > 30% en manque | Dépendances non anticipées | Améliorer la section 5 (Dépendances) de la SPEC |
| Context rot observé | Contexte permanent trop volumineux | Condenser l'AGENT-GUIDE, résumer l'ARCHITECTURE |
| Relances multiples | SPEC imprécise ou contexte insuffisant | Vérifier SQS, envisager `/sdd-split` |
| Agent a ignoré des contraintes | Contexte noyé dans le bruit | Restructurer le prompt (contraintes en premier) |

### Étape 5 — Recommandations

Produis un rapport d'audit concis :

```
AUDIT CONTEXT BUDGET — SPEC-[NNN]
══════════════════════════════════

Estimation : ~[X] tokens
Réel :       ~[X] tokens
Écart :      [+/-X]%

Qualité du contexte : [OPTIMAL / ACCEPTABLE / À AMÉLIORER]

Recommandations :
1. [Recommandation actionnable]
2. [Recommandation actionnable]

Apprentissage pour futures estimations :
- [Pattern à retenir pour le PE]
```

### Étape 6 — Mettre à jour les références

Si l'audit révèle des insights utiles :
1. Mettre à jour la section "Estimation Context Budget" de la SPEC (pour archivage)
2. Si un pattern se répète → l'ajouter dans l'AGENT-GUIDE section "Lessons Learned"
3. Si le PE a mal estimé → l'ajouter dans l'AGENT-GUIDE section "Human Learnings"

### Règles

- L'audit de contexte n'est pas une punition — c'est une boucle d'amélioration
- Le but est que le PE devienne meilleur en estimation, pas de chercher la perfection
- Un écart < 20% est acceptable. Au-delà, creuser la cause
- Le context rot est le signal d'alerte le plus important — il dégrade silencieusement
- Garder les audits courts et actionnables — pas de rapport de 5 pages

$ARGUMENTS
