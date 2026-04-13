---
name: sdd-validate
description: Valider le code produit par un agent IA (technique + fonctionnel + gouvernance)
---

# SDD Mode — Validation du Code Agent

Tu es un Product Engineer AIAD. L'utilisateur veut valider le code produit par un agent IA avant le Drift Lock.

## Contexte SDD Mode

La validation est triple : technique, fonctionnelle et métier. Le code n'est JAMAIS considéré comme terminé tant que la SPEC n'est pas synchronisée (Drift Lock).

## Ta mission

### Étape 1 — Identifier la SPEC et le code

Demande quelle SPEC a été implémentée et identifie les fichiers modifiés (via `git diff` ou `git status`).

### Étape 2 — Validation Technique

Vérifie :

| Check | Commande / Méthode | Résultat |
|-------|-------------------|----------|
| Lint | `[commande lint du projet]` | PASS/FAIL |
| Types | `[commande type-check]` | PASS/FAIL |
| Tests unitaires | `[commande test]` | PASS/FAIL |
| Tests intégration | `[commande test:integration]` | PASS/FAIL |
| Build | `[commande build]` | PASS/FAIL |
| Couverture | `[commande coverage]` | [X]% |

### Étape 3 — Validation Fonctionnelle

Compare le code produit avec la SPEC point par point :

- [ ] **Input** : Le code accepte-t-il exactement les entrées spécifiées ?
- [ ] **Processing** : La logique suit-elle les étapes décrites ?
- [ ] **Output** : Le résultat correspond-il au format attendu ?
- [ ] **Cas limites** : Chaque edge case est-il couvert par un test ?
- [ ] **Critères d'acceptation** : Tous cochés ?

### Étape 4 — Validation Gouvernance

Si le code implique des composants IA, des données personnelles, une interface utilisateur ou des ressources serveur, vérifier les agents de gouvernance applicables :

| Agent | Applicable ? | Conforme ? |
|-------|-------------|-----------|
| AI-ACT (composant IA) | OUI/NON | OUI/NON |
| RGPD (données personnelles) | OUI/NON | OUI/NON |
| RGAA (interface utilisateur) | OUI/NON | OUI/NON |
| RGESN (écoconception) | OUI/NON | OUI/NON |

### Étape 5 — Vérifier le Critère de Drift

Relire le Critère de Drift de l'Intent Statement parent :
> Le signal observable de drift est-il absent ? L'implémentation reste-t-elle alignée avec l'intention ?

### Étape 6 — Décision

| Résultat | Action |
|----------|--------|
| **VALIDÉ** | Procéder au Drift Lock (`/sdd-drift-check`) |
| **CORRECTIONS MINEURES** | Lister les corrections, relancer l'agent sur les points précis |
| **ÉCHEC** | Identifier si le problème vient de la SPEC (imprécision) ou de l'agent (erreur). Mettre à jour Human Learnings ou Lessons Learned selon le cas |

### Règles

- Ne JAMAIS valider du code qui ne passe pas les tests
- Si la SPEC était imprécise, c'est un Human Learning — pas une erreur de l'agent
- Si l'agent a fait une erreur malgré une SPEC claire, c'est un Lesson Learned
- La validation gouvernance n'est pas optionnelle pour les projets concernés

$ARGUMENTS
