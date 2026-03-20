# BP-408 — Scheduled auto-publish

The app saves **`scheduled_publish_at`** on `blog_topic_queue` when a reviewer sets a date/time on a draft in **`review`**.

**Recommended:** n8n Cloud every 15 minutes:

1. **Schedule Trigger** — `*/15 * * * *`
2. Query rows where `scheduled_publish_at <= now()` AND `status = 'review'` AND `scheduled_publish_at IS NOT NULL`
3. Update those rows: `status = 'published'`, `published_at = now()` (and optionally set `approved_by` to a system label)

Use the **service role** key in n8n for the Supabase node if RLS blocks the update.
