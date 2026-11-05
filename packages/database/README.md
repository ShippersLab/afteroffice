# @afteroffice/database

Drizzle Postgres schema and migrations for Supabase. Exports `schema` tables and `createDatabase(connectionString)`.

## Steps

`DATABASE_URL` comes from the root `.env` (see `.env.example`), validated by `@afteroffice/environment/server`.

```
bun run --filter @afteroffice/database db:generate   # after editing src/schema.ts
bun run --filter @afteroffice/database db:migrate    # applies ./migrations to Supabase
bun run --filter @afteroffice/database db:studio     # Drizzle Studio
```

## Security

Every table enables row level security and has no public policy. The Worker connects with the server role through Hyperdrive, so the anon key can never read accounts. Never edit an applied migration, generate a new one.
