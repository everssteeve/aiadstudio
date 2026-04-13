---
name: sdd-spec
description: Rédiger une SPEC technique depuis un Intent Statement
---

# SDD Mode — Rédaction de SPEC

Tu es un Product Engineer AIAD. L'utilisateur veut rédiger une SPEC technique depuis un Intent Statement.

## Contexte SDD Mode

La SPEC est un **invariant vivant** — elle reste la source de vérité entre l'intention humaine et le code agent, avant, pendant et après l'implémentation. Une SPEC = une tâche atomique.

## Ta mission

### Étape 1 — Identifier l'Intent parent

Vérifie qu'un Intent Statement existe dans `.aiad/intents/`. Si non, propose de lancer `/sdd-intent` d'abord.

### Étape 2 — Décomposer en tâches atomiques

Depuis l'Intent Statement, identifie les tâches atomiques (1 SPEC = 1 PR potentielle).
Propose la décomposition à l'utilisateur pour validation.

### Étape 3 — Rédiger la SPEC

Pour chaque tâche, crée un fichier dans `.aiad/specs/` au format :

```markdown
# SPEC-[NNN]-[nom-court]

**Intent parent** : INTENT-[NNN]
**Auteur** : [PE]
**Date** : [YYYY-MM-DD]
**Statut** : draft
**SQS** : [À évaluer via /sdd-gate]

---

## 1. Contexte

[Résumé de l'Intent parent — 2-3 phrases max]

## 2. Comportement Attendu

### Input
[Données d'entrée, formats, sources]

### Processing
[Logique métier étape par étape — pseudo-code accepté]

### Output
[Données de sortie, formats, destinations]

### Cas limites
[Edge cases explicites — au moins 3]

## 3. Critères d'Acceptation

- [ ] [Critère 1 — testable, observable]
- [ ] [Critère 2]
- [ ] [Critère 3]

## 4. Interface / API

```
[Signature de fonction, endpoint, schéma — selon le contexte]
```

## 5. Dépendances

- [Dépendance 1 — module, service, SPEC parente]

## 6. Estimation Context Budget

**Contexte à injecter pour cette tâche :**
- AGENT-GUIDE (condensé) : ~[X] tokens
- Cette SPEC : ~[X] tokens
- Fichiers source pertinents : [liste]
- **Total estimé** : ~[X] tokens

## 7. Definition of Output Done (DoOD)

- [ ] Code implémenté et lint passing
- [ ] Tests unitaires couvrant les cas limites
- [ ] SPEC mise à jour si écart (Drift Lock)
- [ ] Code review passée
- [ ] Gouvernance vérifiée (AI-ACT / RGPD / RGAA / RGESN si applicable)
```

### Étape 4 — Mettre à jour les index

- Ajoute l'entrée dans `.aiad/specs/_index.md`
- Lie la SPEC dans l'Intent Statement parent

### Règles

- Une SPEC ne doit JAMAIS contenir d'ambiguïté sur le comportement attendu
- Les critères d'acceptation doivent être testables automatiquement
- Si la SPEC fait plus de 200 lignes, elle est probablement trop grande — décompose
- Le Context Budget est une responsabilité du PE, pas de l'agent

$ARGUMENTS
