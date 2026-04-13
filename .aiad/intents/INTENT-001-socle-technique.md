# INTENT-001-socle-technique

**Auteur** : Steeve Evers
**Date** : 2026-04-13
**Statut** : active

---

## POURQUOI MAINTENANT

AIAD Studio n'a actuellement aucune infrastructure technique. Pour pouvoir développer
les features du PRD (cycle SDD, orchestration agents, gouvernance, métriques), il faut
d'abord un socle fonctionnel : une API qui répond, une base de données avec le schéma
principal, une UI qui s'affiche, et une authentification qui protège l'accès.
Sans ce socle, aucune feature métier ne peut être développée.

## POUR QUI

Le Product Engineer (Steeve Evers, phase bootstrap) qui a besoin d'une plateforme
fonctionnelle sur laquelle construire les modules AIAD.

## OBJECTIF

Livrer un socle technique opérationnel permettant :
- Démarrer le serveur Express avec une API REST fonctionnelle
- Connecter PostgreSQL avec le schéma de données principal (≥ 22 tables du PRD §7.2)
- Afficher une UI React avec navigation et layout de base
- Authentifier un utilisateur (login/logout)
- Créer/lister des projets (CRUD minimal)

**Métriques de succès** :
- Le serveur démarre en < 5s
- La UI affiche le dashboard après login
- Un utilisateur peut se connecter et voir la liste de ses projets

## CONTRAINTES

- **Temps** : 2 semaines maximum (≤ 3 semaines = critère de drift)
- **Stack** : définie dans ARCHITECTURE.md — aucune négociation
- **Schéma DB** : couvrir au minimum les 22 tables du PRD §7.2 :
  `users`, `projects`, `project_memberships`, `intent_statements`, `specs`,
  `execution_gates`, `issues`, `agents`, `agent_project_access`, `heartbeat_runs`,
  `agent_sessions`, `cost_events`, `budget_incidents`, `governance_audits`,
  `rituals`, `adrs`, `dora_metrics`, `flow_metrics`, `activity_log`,
  `onboarding_progress`, `context_scopes`, `context_sync_events`, `context_access_log`
- **Accessibilité** : RGAA (contraste, navigation clavier, landmarks sémantiques)
- **Infra** : Docker-compose pour setup en une commande

## CRITÈRE DE DRIFT

L'implémentation dérive si :
- Des features métier (cycle SDD, métriques, orchestration...) sont ajoutées dans ce socle
- Le schéma DB inclut des tables non définies dans le PRD §7 OU omet des tables requises par le PRD §7
- L'UI intègre des composants métier au lieu d'un layout navigable vide
- Le temps dépasse 3 semaines sans socle fonctionnel livré

---

## SPECs liées

- [x] [SPEC-001 — Schéma DB 24 tables Drizzle](../specs/archive/SPEC-001-schema-db.md) — done
- [x] [SPEC-002 — Serveur Express Bootstrap](../specs/SPEC-002-serveur-express-bootstrap.md) — done
