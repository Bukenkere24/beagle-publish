---
description: How to check if the Beagle Publish app is working correctly
---

To verify that all systems (Database, Gemini API, Edge Functions) are working correctly, follow these steps:

1. **Ensure environment variables are set**
   Check that your `.env` file contains valid keys:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (Should be a long string starting with `eyJ...`)

2. **Run the automated health check**
   ```bash
   npm run check
   ```

3. **Verify the output**
   - **Green/Success**: All systems are responding.
   - **Red/Error**: Something is down or misconfigured (e.g., 401 Unauthorized means your API key is invalid).

4. **Periodic check (Recommended)**
   Run this command before pushing changes or when you notice issues in the UI.
