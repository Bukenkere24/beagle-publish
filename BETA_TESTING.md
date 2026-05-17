# Beta Testing — Blog Command Center

## How to run

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the app** for manual beta testing:
   ```bash
   npm run beta
   ```
   Or: `npm run dev`

3. Open **http://localhost:5173** in your browser.

4. **Optional:** Test production build:
   ```bash
   npm run build
   npm run preview
   ```
   Then open the URL shown (e.g. http://localhost:4173).

---

## Manual test checklist

### Auth & navigation
- [ ] Unauthenticated user is redirected to `/login`
- [ ] Sidebar shows: Topics, Drafts, Settings
- [ ] Navigating to Topics loads the topics queue

### Topics (BP-402)
- [ ] Topics list loads from `blog_topic_queue`
- [ ] Filter tabs work: All / Queued / In Review / Published / Rejected
- [ ] "Add Topic" opens modal; submitting adds a topic with `source=manual`, `status=queued`
- [ ] Clicking a topic card goes to `/drafts/:id`

### Draft editor (BP-403)
- [ ] Draft page loads topic by id
- [ ] Blog tab: Markdown editor (left) and live preview (right)
- [ ] LinkedIn tab: same for LinkedIn draft
- [ ] Title, slug, meta description are editable; changes save (auto-save or save button)
- [ ] "Generate LinkedIn Draft" calls Edge Function and fills LinkedIn draft

### Publishing (BP-405 / BP-406 — Arya)
- [ ] **Publish to Blog**: Only enabled when `status=review` and draft content exists
- [ ] Clicking "Publish to Blog" opens confirmation modal (title, word count, slug)
- [ ] "Publish Now" sets `status=published`, `published_at`, `approved_by`; UI shows "Published ✓" and blog URL
- [ ] **Reject**: "Reject" button opens confirm modal; confirming sets `status=rejected`
- [ ] **Post to LinkedIn**: Only enabled when LinkedIn draft exists
- [ ] "Post to LinkedIn" opens confirmation; confirming copies draft to clipboard, opens LinkedIn company admin, shows toast "Draft copied! Paste it in LinkedIn → click Post"
- [ ] After LinkedIn flow, `linkedin_published_at` is set and button shows "Published ✓"
- [ ] No console errors on any page

### Settings & roles (BP-407 — Shashank)
- [ ] **Sign in / sign up** works (email); new users default to **editor** in `bcc_profiles` after DB migration
- [ ] **Settings** shows email, display name, and **role** badge (`admin` | `editor`)
- [ ] **Editors** cannot publish: **Publish to Blog**, **Post to LinkedIn**, **Reject**, and confirm modals show disabled controls with tooltip *Requires admin approval*
- [ ] **Admins** can publish and reject as normal
- [ ] Sidebar shows signed-in **email** and **Sign out**

### Schedule (BP-408 — deferred to Week 7+)
- [ ] No in-app scheduling UI in Week 6; `scheduled_publish_at` may still exist in the DB for future automation

### Settings & polish
- [ ] Layout is readable on small viewport (responsive)

---

## Notes

- Ensure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for real data.
- Supabase Edge Function `generate-linkedin` must be deployed for "Generate LinkedIn Draft" to work.
- For full E2E (BP-410): publish 5+ pieces (blog + LinkedIn) and verify on SynthPanel `/blog` and LinkedIn.
