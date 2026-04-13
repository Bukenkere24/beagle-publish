# Health Check Tools for Beagle Publish

I have implemented a set of tools to help you verify if the app is working "everytime".

## 1. Automated Health Check Script
I've created `check-app.js` which performs the following:
- Validates environment variables.
- Tests connection to the Supabase database.
- Tests the Gemini-powered Edge functions (`generate-linkedin`).

### How to use:
Run the following command in your terminal:
```bash
npm run check
```

---

## 2. Findings & Current Issues
While testing the health check, I identified a potential configuration issue:

> [!WARNING]
> **Invalid Supabase Anon Key Detected**
>
> The current `VITE_SUPABASE_ANON_KEY` in your `.env` starts with `sb_publishable_...`. 
> 
> **Action Required:** This looks like a Stripe key, not a Supabase key. Supabase keys are long JWT strings (starting with `eyJ...`). Please update your `.env` with the correct **Project API Key (anon/public)** from your Supabase Dashboard.

---

## 3. Workflow
I've added a workflow file at [.agents/workflows/app-health-check.md](file:///c:/Users/samar/OneDrive/Desktop/family/beagle-publish-automation/.agents/workflows/app-health-check.md) which you can reference anytime for these instructions.
