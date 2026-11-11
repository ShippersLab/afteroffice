# Deploy

Both apps run on the Cloudflare free plan. The database lives on Supabase.

## Local

```
cp .env.example .env     # set DATABASE_URL to the Supabase project
bun install
bun run dev              # realtime on :8787, web on :5173
```

## Production

Every push to `main` runs `.github/workflows/deploy.yml`: typecheck and tests, then both deploys in parallel.

Repository secrets needed:

- `CLOUDFLARE_API_TOKEN`: API token from the "Edit Cloudflare Workers" template.
- `CLOUDFLARE_ACCOUNT_ID`: account id from the Cloudflare dashboard.

By hand, after `bunx wrangler login`:

```
bun run deploy:realtime   # Worker and Durable Objects at api.afteroffice.club
bun run deploy:web        # static site at afteroffice.club
```

`deploy:web` builds with `VITE_REALTIME_URL=https://api.afteroffice.club`, so the local `.env` never leaks into production.

## One time setup

- Migrations: `bun run --filter @afteroffice/database db:migrate`.
- Hyperdrive: `wrangler hyperdrive create afteroffice --connection-string=<DATABASE_URL>`, then put the id in `apps/realtime/wrangler.jsonc`. The connection string must use the Supabase session pooler on port 5432. The transaction pooler on 6543 makes `/v1/join` hang. To fix an existing config: `wrangler hyperdrive update <id> --origin-host=<pooler host> --origin-port=5432`.
- The apex `afteroffice.club` must have no other A or CNAME records, or the web Worker cannot take the custom domain.
