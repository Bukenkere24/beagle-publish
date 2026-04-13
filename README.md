# Team Beagle — Week 5: Beagle Publish Becomes a Product

**Avaneesh · Samarth · Arya · Shashank**
**Repo: `beagle-publish`**
**Live URL: `https://beagle-publish-gamma.vercel.app`**

## Status
- **BP-501 (Cleanup)**: ✅ Done
- **BP-502 (Auth)**: ✅ Done
- **BP-503 (Workspaces)**: ✅ Done
- **BP-504 (AI engine)**: ✅ Done
- **BP-505 (Settings)**: ✅ Done
- **BP-506 (Publishing)**: 🚧 In Progress
- **BP-507 (Admin)**: ✅ Done
- **BP-508 (Landing page)**: 🚧 In Progress

## Tech Stack
- **Frontend**: Vite + React 19 + TypeScript + Tailwind 4
- **Backend**: Supabase Auth + Postgres + RLS
- **AI**: Gemini 2.0 Flash via Supabase Edge Functions
- **Deployment**: Vercel (Frontend) + Supabase (Functions/SQL)

## Development
1. Install Supabase CLI: `npm install -g supabase`
2. Login & Link: `supabase login` && `supabase link --project-ref <ref>`
3. Run local dev: `npm run dev`

## Core Loop
1. Sign up with Google
2. Create/Queue Topic
3. AI generates Research Brief + Blog Draft
4. Polish and Generate LinkedIn Post
5. Publish to SynthPanel / Webhook
