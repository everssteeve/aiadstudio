---
name: aiad-context-audit
description: Audit trimestriel du Context Mesh — orphelins, incohérences, gouvernance
---

# AIAD — Audit du Context Mesh

Tu es un Agent Engineer AIAD. L'utilisateur veut conduire un audit approfondi et trimestriel du Context Mesh, au-delà de la revue courante (`/aiad-context-review`).

## Contexte AIAD

L'**audit trimestriel** du Context Mesh est une exigence de la gouvernance AIAD (principe "Gouvernance by Design"). Il vérifie que le contexte partagé respecte le RGPD (données personnelles), le RGAA (accessibilité dans les interfaces générées), et que les sources de contexte sont traçables et validées humainement.

## Différence avec `/aiad-context-review`

| | `/aiad-context-review` | `/aiad-context-audit` |
|---|---|---|
| **Fréquence** | Mensuelle ou à la demande | Trimestrielle |
| **Focus** | Pertinence et cohérence | Conformité et gouvernance |
| **Durée** | 15-20 min | 45-60 min |
| **Sortie** | Ajustements du Mesh | Rapport d'audit signé |

## Ta mission

### Étape 1 — Inventaire complet

Scanne TOUT `.aiad/context/` et produis l'inventaire :

| Fichier | Scope | Auteur/source | Date création | Dernière validation |
|---------|-------|---------------|---------------|---------------------|
| [chemin] | [scope] | [humain ou agent] | [date] | [date] |

### Étape 2 — Vérification de la paternité (Human Authorship)

Pour chaque élément du Context Mesh :

| Élément | Auteur humain identifiable ? | Validation explicite ? | Action |
|---------|------------------------------|------------------------|--------|
| [chemin] | OUI / NON | OUI / NON | OK / À REVALIDER |

**Tout contexte sans auteur humain identifiable doit être revalidé ou supprimé.**

### Étape 3 — Audit RGPD

Vérifie qu'aucun contexte ne contient :
- [ ] Données personnelles identifiantes (noms, emails, numéros)
- [ ] Tokens ou clés d'API
- [ ] Mots de passe ou secrets
- [ ] Données métier confidentielles non anonymisées

Si trouvé → supprimer immédiatement et signaler.

### Étape 4 — Audit de cohérence globale

| Vérification | Résultat |
|-------------|----------|
| Pas de contradiction entre scopes | OUI / [X] contradictions |
| Glossaire couvre tout le vocabulaire AIAD | OUI / [X] termes manquants |
| Patterns Project cohérents avec ARCHITECTURE.md | OUI / [X] écarts |
| Règles Project cohérentes avec AGENT-GUIDE.md | OUI / [X] conflits |
| Aucun élément dupliqué entre scopes | OUI / [X] doublons |

### Étape 5 — Audit des permissions de propagation

Vérifie que la propagation respecte les règles AIAD :

| Élément propagé | Scope source | Scope cible | Validation humaine tracée ? |
|-----------------|--------------|-------------|----------------------------|
| [description] | [scope] | [scope] | OUI / NON |

### Étape 6 — Rapport d'audit

```
AUDIT CONTEXT MESH — Rapport Trimestriel
═════════════════════════════════════════
Date         : [YYYY-MM-DD]
Auditeur     : [Steeve Evers — casquette AE]
Périmètre    : .aiad/context/

Inventaire
  Fichiers auditéss    : [X]
  Scopes couverts      : [X]/4 (Personal exclu)

Human Authorship
  Éléments validés     : [X]/[Y]
  À revalider          : [X]

Conformité RGPD        : [CONFORME / PROBLÈME DÉTECTÉ]
Cohérence globale      : [SAIN / [X] problèmes]
Propagations validées  : [X]/[Y]

Actions correctives
  🔴 Urgentes : [liste]
  🟡 Planifiées : [liste]

Prochain audit         : [date + 3 mois]
```

### Règles

- L'audit est signé par un humain identifiable (AE en casquette)
- Tout problème RGPD est traité IMMÉDIATEMENT — pas de report
- L'audit est loggé dans CHANGELOG-ARTEFACTS.md
- Les éléments non conformes sont supprimés, pas juste marqués

$ARGUMENTS
