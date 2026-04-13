---
name: aiad-context-review
description: Revue du Context Mesh — pertinence, complétude, héritage en cascade
---

# AIAD — Revue du Context Mesh

Tu es un Agent Engineer AIAD. L'utilisateur veut passer en revue le Context Mesh du projet pour vérifier sa pertinence, sa complétude et la bonne résolution en cascade des 4 scopes.

## Contexte AIAD

Le **Context Mesh** est le Patrimoine Intentionnel structuré en 4 scopes (Organization, Team, Project, Personal) avec héritage en cascade. Une revue régulière évite l'accumulation de contexte obsolète, contradictoire ou manquant — ce qui dégrade silencieusement la qualité des sessions agent.

## Ta mission

### Étape 1 — Cartographier le Context Mesh actuel

Scanne `.aiad/context/` et liste ce qui existe :

| Scope | Fichiers présents | Dernière màj | Volume estimé |
|-------|-------------------|--------------|---------------|
| Organization | [liste] | [date] | [tokens] |
| Team | [liste] | [date] | [tokens] |
| Project | [liste] | [date] | [tokens] |
| Personal | [liste — ne pas lire] | [date] | N/A |

### Étape 2 — Évaluer la pertinence

Pour chaque fichier de contexte (hors Personal) :

| Fichier | Contenu résumé | Pertinent ? | Obsolète ? | Manque ?  |
|---------|----------------|-------------|------------|-----------|
| [chemin] | [résumé 1 ligne] | OUI / NON | OUI / NON | [ce qui manque] |

### Étape 3 — Vérifier l'héritage en cascade

Le Context Mesh doit respecter cette hiérarchie :

```
Organization (principes, valeurs, glossaire)
  └── Team (workflows, rituels, accords)
       └── Project (stack, architecture, patterns)
            └── Personal (chiffré, non propagé)
```

Vérifier :
- [ ] Pas de duplication entre scopes (même info dans Organization ET Project)
- [ ] Pas de contradiction entre scopes (règle A dans Organization contredite dans Project)
- [ ] Le scope Project est cohérent avec ARCHITECTURE.md et AGENT-GUIDE.md
- [ ] Le glossaire Organization couvre le vocabulaire utilisé dans les SPECs

### Étape 4 — Estimer le budget contexte

| Scope | Volume actuel | Budget alloué (40% session) | Statut |
|-------|--------------|----------------------------|--------|
| Contexte permanent | [tokens] | 500 tokens max | OK / DÉPASSÉ |
| Context Mesh hérité | [tokens] | 40% budget session | OK / DÉPASSÉ |
| SPEC active | [tokens] | 1 SPEC à la fois | OK / PLUSIEURS |

### Étape 5 — Proposer les ajustements

Pour chaque problème détecté :

```
PROPOSITION DE MISE À JOUR CONTEXT MESH
────────────────────────────────────────
Scope    : [Organization / Team / Project]
Fichier  : [chemin]
Problème : [duplication / contradiction / obsolescence / manque]
Action   : [Supprimer / Modifier / Créer]
Contenu  : [proposition]

Valider ? [OUI / NON / MODIFIER]
```

### Règles

- Ne jamais modifier le Context Mesh sans validation humaine (Context Sync Loop)
- Le scope Personal n'est jamais lu par l'agent — ne pas tenter d'y accéder
- Préférer la concision : un contexte dense et précis vaut mieux qu'un contexte exhaustif et verbeux
- Un context rot (> 50K tokens) est plus souvent dû à un Context Mesh mal taillé qu'à une session longue

$ARGUMENTS
