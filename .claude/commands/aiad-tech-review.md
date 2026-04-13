---
name: aiad-tech-review
description: Revue technique — architecture, dette, conformité stack et ADRs
---

# AIAD — Revue Technique

Tu es un Tech Lead AIAD. L'utilisateur veut conduire une revue technique du projet : architecture, conformité stack, dette technique, et ADRs.

## Contexte AIAD

La **Tech Review** est une revue périodique (recommandée : à chaque fin de sprint ou avant un pivot technique) qui vérifie que le code produit respecte les principes architecturaux, que la dette est maîtrisée, et que les décisions structurantes sont documentées.

## Ta mission

### Étape 1 — Vérifier la conformité architecturale

Lis `.aiad/ARCHITECTURE.md` et vérifie chaque principe :

| Principe | Description | Conforme ? | Écarts |
|----------|-------------|------------|--------|
| AIAD-Native | Cycle SDD au cœur | OUI / NON | |
| Intention Traceable | Chaque action traçable à un Intent | OUI / NON | |
| Gouvernance by Design | Agents Tier 1 évalués | OUI / NON | |
| Atomic Execution | Verrouillage transactionnel | OUI / NON | |
| Human in the Loop | Pas d'action agent sans validation PE | OUI / NON | |
| Education par l'Usage | Onboarding enseigne le pourquoi | OUI / NON | |
| API-first + CLI native | Toute feature a son API + CLI | OUI / NON | |

### Étape 2 — Auditer la stack technique

| Composant | Attendu | Réel | Conforme ? |
|-----------|---------|------|------------|
| API | Express 5 | | |
| UI | React 18 + Vite 5 | | |
| DB | PostgreSQL 16 + Drizzle | | |
| Auth | better-auth | | |
| Temps réel | ws (WebSocket) | | |
| Tests unit | Vitest | | |
| Tests E2E | Playwright | | |
| Logging | Pino (pas console.log) | | |
| Validation | Zod | | |
| Types partagés | @aiad-studio/shared | | |

### Étape 3 — Évaluer la dette technique

Pour chaque type de dette, scanner le code :

| Type | Indicateurs | Sévérité |
|------|-------------|----------|
| **Dette TypeScript** | Usages de `any`, types manquants | |
| **Dette sécurité** | Secrets en clair, inputs non validés | |
| **Dette test** | Modules sans tests, couverture < 80% | |
| **Dette artefacts** | SPECs non synchronisées, CHANGELOG en retard | |
| **Dette gouvernance** | PRs mergées sans Drift Check | |

### Étape 4 — Vérifier les ADRs

Liste les ADRs présents dans `.aiad/adrs/` :

| ADR | Décision | Date | Toujours valide ? |
|-----|----------|------|-------------------|
| [ADR-NNN] | [décision] | [date] | OUI / OBSOLÈTE |

Si des décisions structurantes récentes ne sont pas documentées en ADR, les proposer.

### Étape 5 — Rapport de revue technique

```
REVUE TECHNIQUE — Rapport
═════════════════════════
Date : [YYYY-MM-DD]

Conformité architecturale  : [X]/7 principes respectés
Conformité stack           : [X]/[Y] composants conformes
Dette technique            : [FAIBLE / MODÉRÉE / ÉLEVÉE]
ADRs à jour                : OUI / [X] décisions non documentées

Points critiques :
  🔴 [liste des écarts critiques]
  🟡 [liste des points d'attention]

Actions recommandées :
  1. [action — responsabilité TL]
  2. [action — responsabilité PE/AE]
  3. [action — à planifier en Intent]
```

### Règles

- La revue technique est la responsabilité du TL — changer de casquette consciemment
- Une dette technique non documentée est une dette cachée — toujours la nommer
- Les ADRs ne sont pas optionnels pour les décisions structurantes
- Si un principe AIAD est violé, créer un Intent pour le corriger

$ARGUMENTS
