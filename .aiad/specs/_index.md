# Index des SPECs

> Chaque SPEC est une spécification technique atomique liée à un Intent Statement.
> Format : `SPEC-NNN-[nom-court].md`
> Commande : `/sdd-spec` dans Claude Code

| ID | Titre | Intent parent | SQS | Statut | PR |
|----|-------|---------------|-----|--------|----|
| [SPEC-001](archive/SPEC-001-schema-db.md) | Schéma DB — 24 tables Drizzle | INTENT-001 | 4/5 ✓ | archived | — |
| [SPEC-002](SPEC-002-serveur-express-bootstrap.md) | Serveur Express Bootstrap | INTENT-001 | 4/5 ✓ | done | — |

## Statuts possibles

- **draft** — SPEC en cours de rédaction
- **review** — En attente de validation SQS (Execution Gate)
- **ready** — SQS >= 4/5, prête pour développement agent
- **in-progress** — Agent en cours de développement
- **validation** — Code produit, en validation QA
- **done** — Code + SPEC synchronisés, PR mergée (Drift Lock)
- **archived** — Déplacée dans `archive/`
