# Blog Command Center (Beagle Publish)

Content operations dashboard — topics from n8n, AI drafts, review & publish to blog + LinkedIn.

## Avaneesh's tickets (BP-401, BP-402)

- **BP-401** — Scaffold app (this repo): Vite + React + Tailwind + Supabase, routes, Layout, AuthGuard. ✅ Done.
- **BP-402** — Topics Queue: list from `blog_topic_queue`, filter tabs, "Add Topic" button, click → `/drafts/:id`.

## Quick start

1. **Env:** Copy `.env.example` to `.env` and set `VITE_SUPABASE_ANON_KEY` (ask Adi / same as SynthPanel).
2. **Run:** `npm install` then `npm run dev` → http://localhost:5173
3. **Auth bypass:** `VITE_DEV_SKIP_AUTH=true` in `.env` lets you develop without login (remove before demo).

## Repo

The doc says: create repo under **beagle-ai-solutions** org on GitHub. If it doesn’t exist yet, init and push when it’s created:

```bash
git init
git add .
git commit -m "feat(BP-401): scaffold Blog Command Center app"
git remote add origin https://github.com/beagle-ai-solutions/beagle-publish.git
git push -u origin main
```

## Supabase (run in SQL Editor)

**New columns:**

```sql
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS linkedin_draft TEXT;
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS linkedin_post_id TEXT;
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS linkedin_published_at TIMESTAMPTZ;
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMPTZ;
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS destination TEXT[] DEFAULT '{blog}';
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE blog_topic_queue ADD COLUMN IF NOT EXISTS approved_by TEXT;
```

**RLS fix (run after checking policy name):**

```sql
SELECT policyname FROM pg_policies WHERE tablename = 'blog_topic_queue';
-- Then drop the anon insert policy (use name from above) and:
DROP POLICY IF EXISTS "anon_insert" ON blog_topic_queue;
CREATE POLICY "service_role_insert" ON blog_topic_queue FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "authenticated_update" ON blog_topic_queue FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

## Routes

- `/topics` — Topics queue (BP-402)
- `/drafts/:id` — Draft editor (BP-403)
- `/settings` — Settings (BP-407)
- `/login` — Login (BP-407)
