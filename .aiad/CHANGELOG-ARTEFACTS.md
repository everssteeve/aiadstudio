# Changelog des Artefacts AIAD

| Date | Artefact | Action | Détail |
|------|----------|--------|--------|
| 2026-04-13 | SPEC-002-serveur-express-bootstrap | Livraison | Serveur Express bootstrap : dotenv, pino-http, /health, shutdown gracieux — INTENT-001 |
| 2026-04-13 | packages/db/src/connection.ts | Création | Connexion Drizzle/pg (db + dbPool) — écart SPEC-002 documenté |
| 2026-04-13 | packages/shared/src/types/health.ts | Création | Type HealthResponse — SPEC-002 |
| 2026-04-13 | server/src/routes/health.ts | Création | Route GET /health 200/503 — SPEC-002 |
| 2026-04-13 | server/tsconfig.json | Mise à jour | rootDir élargi à "../" pour monorepo cross-package — Human Learning SPEC-002 |
| 2026-04-13 | AGENT-GUIDE.md | Mise à jour | +2 Human Learnings : rootDir monorepo + dual-instance drizzle-orm |
| 2026-04-13 | SPEC-001-schema-db | Livraison | Schéma Drizzle 24 tables + migration SQL — INTENT-001 |
| 2026-04-13 | INTENT-001-socle-technique | Mise à jour | SPECs liées : SPEC-001 liée |
| 2026-04-13 | specs/_index.md | Mise à jour | SPEC-001 → done, SQS 4/5 |
| 2026-04-13 | TEAM.md | Création | Équipe bootstrap solo — 5 casquettes, 1 titulaire |
| 2026-04-13 | PRD.md | Validation | Statut Draft → Validé par Steeve Evers |
| 2026-04-13 | Structure .aiad/ | Création | /sdd-init — scaffolding initial |
| 2026-04-13 | PRD.md | Création | PRD AIAD Studio v2.0 |
| 2026-04-13 | ARCHITECTURE.md | Création | Squelette architecture initiale + Context Mesh |
| 2026-04-13 | AGENT-GUIDE.md | Création | Guide agent initial + vocabulaire Context Mesh |
| 2026-04-13 | context/ | Création | Socle Context Mesh (CONTEXT.md, skills/, rules/, decisions/) |
