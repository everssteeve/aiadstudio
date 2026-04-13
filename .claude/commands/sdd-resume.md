---
name: sdd-resume
description: Reprendre une session agent interrompue sans perdre le travail déjà fait
---

# SDD Mode — Reprise de Session Agent

Tu es un Product Engineer AIAD. L'utilisateur veut reprendre une session agent qui a été interrompue (timeout, erreur, changement de contexte, limite de conversation).

## Contexte SDD Mode

Les sessions agent sont interrompues en pratique. Le risque : recommencer de zéro en gaspillant du budget de contexte, ou pire, produire des incohérences avec le code déjà généré. Cette commande reconstruit le contexte minimal nécessaire pour reprendre proprement.

## Ta mission

### Étape 1 — Diagnostiquer l'état de la session

Identifie la SPEC en cours et évalue l'état :

| Élément | État |
|---------|------|
| SPEC en cours | SPEC-[NNN] — statut `in-progress` |
| Cause d'interruption | Timeout / Erreur / Limite conversation / Volontaire |
| Code déjà produit | OUI / NON — lister les fichiers modifiés |
| Tests existants | OUI / NON — passent-ils ? |
| Dernière action réussie | [Description de la dernière modification valide] |

### Étape 2 — Inventorier le travail fait

Scanne les changements depuis le début de l'exécution :

```bash
# Fichiers modifiés (non commités)
git status

# Diff complet du travail en cours
git diff

# Si des commits intermédiaires existent
git log --oneline -10
```

Produis un résumé structuré :

```
ÉTAT DE LA SESSION — SPEC-[NNN]
════════════════════════════════

Fichiers créés :     [liste]
Fichiers modifiés :  [liste]
Tests ajoutés :      [X] ([Y] passent, [Z] échouent)
Critères d'acceptation complétés : [X]/[Y]

Travail restant :
- [ ] [Critère d'acceptation non couvert 1]
- [ ] [Critère d'acceptation non couvert 2]
```

### Étape 3 — Reconstruire le contexte minimal

Assemble le contexte de reprise — **uniquement ce qui est nécessaire** :

**Toujours inclure :**
- AGENT-GUIDE.md (condensé — règles TOUJOURS/JAMAIS)
- La SPEC complète
- Le résumé de l'état actuel (Étape 2)

**Inclure si pertinent :**
- Les fichiers modifiés (pas les fichiers inchangés)
- Les erreurs de test en cours
- Les messages d'erreur de la session précédente

**Ne PAS inclure :**
- Le contexte de la session précédente en entier
- Les fichiers source déjà traités avec succès
- L'ARCHITECTURE complète (résumé suffit)

### Étape 4 — Formuler le prompt de reprise

```
## Contexte de reprise
Tu reprends une tâche en cours. Voici l'état actuel.

## SPEC en cours
[SPEC complète]

## Travail déjà réalisé
[Résumé structuré de l'étape 2]
[Diff des fichiers modifiés si nécessaire]

## Ce qui reste à faire
[Critères d'acceptation non complétés]

## Erreurs en cours (le cas échéant)
[Messages d'erreur ou tests en échec]

## Contraintes
[Règles TOUJOURS/JAMAIS de l'AGENT-GUIDE]
Ne PAS modifier les parties déjà validées sauf si nécessaire pour la cohérence.
```

### Étape 5 — Relancer et vérifier

1. **Relancer l'agent** avec le contexte de reprise
2. **Vérifier** que le nouveau code est cohérent avec le code déjà produit
3. **Exécuter tous les tests** (pas seulement les nouveaux)
4. **Si succès** → procéder au `/sdd-validate`
5. **Si échec récurrent** → envisager `/sdd-split` pour décomposer le travail restant

### Règles

- La reprise de session est NORMALE — ne pas recommencer de zéro par défaut
- Le contexte de reprise doit être plus léger que le contexte initial (on sait déjà ce qui fonctionne)
- Toujours vérifier la cohérence entre ancien et nouveau code après reprise
- Si la reprise échoue 2 fois, c'est un signal : la SPEC est probablement trop grosse → `/sdd-split`
- Documenter la cause de l'interruption pour les audits de contexte (`/sdd-context`)

$ARGUMENTS
