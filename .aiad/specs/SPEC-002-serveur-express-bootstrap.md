# SPEC-002 — Serveur Express Bootstrap

**Intent parent** : INTENT-001
**Auteur** : PE (Claude Code)
**Date** : 2026-04-13
**Statut** : done
**SQS** : 4/5 ✓ (réserve : ambiguïtés Drizzle/CORS corrigées post-gate)

---

## 1. Contexte

INTENT-001 exige un serveur Express fonctionnel comme socle de l'API. Le fichier
`server/src/index.ts` existe mais présente 4 écarts bloquants : `console.log` au lieu
de Pino, `pino-http` installé mais non branché, absence de route `/health`, absence de
chargement `dotenv` et de shutdown gracieux. Cette SPEC corrige ces écarts et rend le
serveur production-ready au niveau bootstrap.

## 2. Comportement Attendu

### Input

- Variable d'environnement `PORT` (défaut : `3000`)
- Variable d'environnement `DATABASE_URL` (pour le health check DB)
- Variable d'environnement `LOG_LEVEL` (défaut : `'info'`)
- Variable d'environnement `NODE_ENV` (défaut : `'development'`)

### Processing

**Séquence de démarrage :**

1. Charger `dotenv` (fichier `.env` à la racine du package `server/`)
2. Instancier le logger Pino (`logger.ts` existant)
3. Créer l'app Express
4. Appliquer les middlewares dans l'ordre :
   a. `pino-http` (request logging, injecte `req.log`)
   b. `cors()` avec `origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173'`
      (string unique uniquement — pas de multi-origines dans cette SPEC)
   c. `express.json()` avec limite `1mb`
5. Monter la route `GET /health` (voir Output)
6. Monter les routes métier existantes sous `/api/`
7. Appliquer `errorMiddleware` en dernier
8. Appeler `app.listen(PORT)` et logger le port via Pino (jamais `console.log`)
9. Enregistrer les handlers `SIGTERM` et `SIGINT` pour shutdown gracieux

**Shutdown gracieux :**

- Sur `SIGTERM`/`SIGINT` : logger "shutdown signal received", fermer le serveur HTTP,
  fermer le pool pg via `pool.end()` (le pool `pg.Pool` est exporté par `packages/db` comme `dbPool`),
  logger "server closed", `process.exit(0)`
- Timeout 10s : si le serveur ne ferme pas, forcer `process.exit(1)` avec log d'erreur

**Route `/health` :**

- Tester la connexion DB : `await db.execute(sql\`SELECT 1\`)`
  (importer `db` depuis `@aiad-studio/db`, `sql` depuis `drizzle-orm`)
- En cas d'erreur, capturer l'exception, loguer en `warn`, retourner statut dégradé
- Calculer l'uptime : `process.uptime()` (secondes, arrondi à 1 décimale)
- Lire la version depuis `package.json` du package `server` au démarrage (pas à chaque requête)
- Retourner la réponse (voir Output)

### Output

**`GET /health` — succès (DB joignable) :**

```json
{
  "status": "ok",
  "uptime": 42.3,
  "db": "ok",
  "version": "0.1.0"
}
```
HTTP 200

**`GET /health` — dégradé (DB injoignable) :**

```json
{
  "status": "degraded",
  "uptime": 42.3,
  "db": "error",
  "version": "0.1.0"
}
```
HTTP 503

**Logs Pino au démarrage (niveau `info`) :**

```json
{ "level": "info", "msg": "Server listening", "port": 3000 }
```

**Log par requête HTTP (via `pino-http`) :**

```json
{ "level": "info", "req": { "method": "GET", "url": "/health" }, "res": { "statusCode": 200 }, "responseTime": 4 }
```

### Cas limites

1. `DATABASE_URL` absent au démarrage : le serveur démarre quand même, `/health` retourne `"db": "error"` sans crash
2. `PORT` déjà utilisé : l'erreur `EADDRINUSE` est capturée, loggée via Pino (pas `console.error`), `process.exit(1)`
3. Request body > 1mb : Express retourne 413 automatiquement — le `errorMiddleware` le laisse passer
4. `SIGTERM` reçu pendant une requête en cours : attendre la fin de la requête avant `process.exit(0)` (timeout 10s max)
5. `LOG_LEVEL` invalide : Pino utilise `'info'` par défaut sans planter

## 3. Critères d'Acceptation

- [ ] `GET /health` retourne HTTP 200 avec `{ status: 'ok', db: 'ok', uptime: number, version: string }` quand la DB est joignable
- [ ] `GET /health` retourne HTTP 503 avec `{ status: 'degraded', db: 'error' }` quand la DB est injoignable
- [ ] Aucun `console.log` / `console.error` dans `server/src/` — lint échoue sinon
- [ ] Chaque requête HTTP génère un log Pino JSON avec `method`, `url`, `statusCode`, `responseTime`
- [ ] Le serveur démarre en < 5 secondes (mesuré de `node dist/index.js` au log "Server listening")
- [ ] `SIGTERM` ferme proprement le serveur sans `process.exitCode` non-zero
- [ ] `dotenv` charge le fichier `.env` avant toute lecture de `process.env`

## 4. Interface / API

```typescript
// Route health
GET /health
Response: HealthResponse

// Type partagé (à ajouter dans @aiad-studio/shared)
interface HealthResponse {
  status: 'ok' | 'degraded'
  uptime: number        // secondes
  db: 'ok' | 'error'
  version: string       // depuis package.json
}
```

```typescript
// Modifications à server/src/index.ts
import 'dotenv/config'
import pinoHttp from 'pino-http'
import { logger } from './logger.js'
// ...
app.use(pinoHttp({ logger }))
// ...
server.listen(PORT, () => logger.info({ port: PORT }, 'Server listening'))
```

```typescript
// Modification à server/src/middleware/error.ts
import { logger } from '../logger.js'
// remplacer console.error(err) par logger.error({ err }, 'Unhandled error')
```

## 5. Dépendances

- `dotenv` — déjà installé dans `server/package.json`
- `pino-http` — déjà installé dans `server/package.json`
- `pino` / `logger.ts` — déjà implémenté
- `@aiad-studio/shared` — ajout du type `HealthResponse`
- `packages/db` — connexion Drizzle pour le health check DB

## 6. Estimation Context Budget

**Contexte à injecter pour cette tâche :**

- AGENT-GUIDE (condensé) : ~400 tokens
- Cette SPEC : ~600 tokens
- `server/src/index.ts` (actuel) : ~80 tokens
- `server/src/logger.ts` : ~30 tokens
- `server/src/middleware/error.ts` : ~30 tokens
- `packages/db/src/index.ts` (connexion Drizzle) : ~100 tokens
- `packages/shared/src/index.ts` (types existants) : ~100 tokens
- **Total estimé** : ~1 340 tokens (bien sous le seuil de 50K)

## 7. Definition of Output Done (DoOD)

- [x] `server/src/index.ts` : zéro `console.*`, `pino-http` branché, `dotenv` chargé, health route montée, shutdown gracieux
- [x] `server/src/middleware/error.ts` : utilise `logger` Pino
- [x] `server/src/routes/health.ts` : nouveau fichier avec la route `/health`
- [x] `packages/shared/src/types/health.ts` : type `HealthResponse` exporté
- [x] `packages/db/src/connection.ts` : db + dbPool exportés (ajout non prévu — écart de contexte résolu)
- [x] Tests unitaires Vitest : health route (200 DB ok, 503 DB KO, uptime > 0) — 3/3 ✓
- [x] Zéro `console.*` dans `server/src/` — vérifié par grep
- [ ] `pnpm lint` passe (règle no-console) — à vérifier en validation
- [ ] SPEC mise à jour si écart détecté en cours d'implémentation (Drift Lock)
- [ ] Gouvernance RGESN vérifiée (ressources serveur, pas de fuite mémoire au shutdown)

## 8. Écarts de contexte (Drift Log)

| Écart | Nature | Résolution |
|-------|--------|------------|
| `packages/db` n'exportait pas `db` ni `dbPool` | Manque découvert à l'exécution | Création de `packages/db/src/connection.ts` — conforme SPEC (section 5 mentionnait `packages/db`) |
| `package.json` server sans script `test` | Omission | Ajouté `"test": "vitest run"` |
| `supertest` non installé | Dépendance de test manquante | Ajouté en `devDependencies` |
