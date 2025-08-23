# HarborPoint Backend Setup (Cloudflare Pages + D1)

This project uses Cloudflare Pages Functions with a D1 database bound as `env.DB`.

## 1. Prerequisites
- Cloudflare account with Pages + D1 enabled
- Wrangler CLI installed and logged in:
  ```powershell
  npm i -g wrangler
  wrangler login
  ```

## 2. Create Databases
Create production and preview databases:
```powershell
wrangler d1 create harborpoint-members
wrangler d1 create harborpoint-members-preview
```
Copy the returned UUIDs into `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "harborpoint-members"
database_id = "<PROD_UUID>"

[env.preview]
[[env.preview.d1_databases]]
binding = "DB"
database_name = "harborpoint-members-preview"
database_id = "<PREVIEW_UUID>"
```

## 3. Secrets / Vars
Edit `wrangler.toml` and replace placeholder JWT secrets. Generate secrets:
```powershell
# 48 bytes base64 ( ~64 chars )
openssl rand -base64 48
```
(or use any secure generator.)

Alternatively store JWT secret as an encrypted secret:
```powershell
wrangler secret put JWT_SECRET
```
Then remove it from the `[vars]` section so it's not committed.

## 4. Initialize Schema
Apply schema to each database:
```powershell
# Local (development binding)
npm run db:init

# Remote (Cloudflare D1 production)
npm run db:init-remote

# Preview remote (if needed)
wrangler d1 execute harborpoint-members-preview --file=./schema.sql --remote
```

If you add migrations later, create a `migrations` folder and apply them sequentially. Keep `schema.sql` as a canonical full schema snapshot.

## 5. Local Development
There are two primary flows:

1. Frontend + Functions with a built frontend directory:
```powershell
npm install
npm run build
npm run db:init
npm run dev:local   # pages dev serving built dist + functions
```

2. Live-refresh both frontend (Vite) and backend (Pages Functions):
```powershell
npm install
npm run db:init
npm run dev:full    # concurrently runs vite (frontend) and pages functions
```
Use `npm run dev:backend` alone if you only want to exercise the API endpoints.

## 6. Querying the DB
Ad-hoc queries:
```powershell
npm run db:query -- "SELECT * FROM members LIMIT 5;"
```
Remote:
```powershell
npm run db:query-remote -- "SELECT COUNT(*) FROM members;"
```

## 7. Authentication Overview
Sessions & JWT logic remain unchanged. `env.DB` is provided by D1 automatically based on the binding in `wrangler.toml`.

## 8. Deployment
Build and deploy Pages:
```powershell
npm run deploy
```
This runs `vite build` and then `wrangler pages deploy dist`.
Ensure the production D1 database and any secrets are configured in the Cloudflare dashboard for the Pages project named `harborpoint`.

## 9. Environment Parity Checklist
- [ ] `wrangler.toml` production DB UUID set
- [ ] `wrangler.toml` preview DB UUID set
- [ ] JWT secrets set (either inline or via `wrangler secret`)
- [ ] Schema applied to both DBs
- [ ] Admin user inserted (from `schema.sql` default)

## 10. Common Issues
| Symptom | Fix |
|---------|-----|
| 500 errors from API | Check Wrangler console logs (`wrangler pages dev`) and ensure DB IDs are correct |
| Unauthorized responses | Confirm `session` cookie is set and not blocked by browser (check domain / path) |
| Schema missing tables | Re-run `npm run db:init` or remote variant |
| JWT mismatch | Ensure same JWT secret value in local dev and remote env when using JWT sessions |

## 11. Adding Migrations
Create files like `migrations/001_add_table.sql` and apply with:
```powershell
wrangler d1 execute harborpoint-members --file=./migrations/001_add_table.sql
```
Keep numbering monotonic. Update `schema.sql` occasionally with a fresh dump (manually curated) so new environments can bootstrap quickly.

---
This guide covers the backend conversion from the previous Birchwood project naming to HarborPoint while retaining API logic.
