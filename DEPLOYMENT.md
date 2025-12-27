# Career Prediction AI - Deployment Guide

This guide covers **two deployment options**:
1. **100% Local with Ollama** (Recommended - no API keys, no blocking)
2. **Cloud deployment** with Vercel + Supabase

---

## Option 1: 100% Local with Ollama (Recommended)

This setup runs everything on your computer with no external AI dependencies.

### Prerequisites
- Node.js 18+
- Docker Desktop
- 8GB+ RAM recommended

### Step 1: Install Ollama

**Windows:**
1. Download from: https://ollama.com/download/windows
2. Run the installer
3. Verify: `ollama --version`

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Step 2: Download AI Model

```bash
# Recommended (4GB download, good balance)
ollama pull llama3.2

# Or for better quality (8GB download)
ollama pull llama3.1
```

### Step 3: Verify Ollama is Running

```bash
ollama list
# Should show: llama3.2 or llama3.1
```

Ollama server runs at `http://localhost:11434`

### Step 4: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 5: Start Local Supabase

```bash
cd your-project-folder
supabase start
```

**Save the output!** You'll need:
- `API URL` → `http://localhost:54321`
- `anon key` → long string starting with `eyJ...`

### Step 6: Create Local Environment File

Create `supabase/.env.local`:
```env
USE_LOCAL_OLLAMA=true
OLLAMA_URL=http://host.docker.internal:11434
OLLAMA_MODEL=llama3.2
```

### Step 7: Serve Edge Function

```bash
supabase functions serve analyze-resume --env-file supabase/.env.local
```

### Step 8: Configure Frontend

Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<anon key from step 5>
```

### Step 9: Run Frontend

```bash
npm install
npm run dev
```

### Step 10: Test

Open `http://localhost:8080`, upload a resume, and analyze!

---

## Architecture (Local)

```
┌─────────────────────────────────────────────────────────┐
│                    Your Computer                         │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐      ┌─────────────────┐              │
│  │   Browser    │─────▶│  Vite Dev Server │              │
│  │ localhost:   │      │  localhost:8080  │              │
│  │   8080       │      └────────┬─────────┘              │
│  └──────────────┘               │                        │
│                                 ▼                        │
│                    ┌─────────────────────┐               │
│                    │  Supabase (Docker)  │               │
│                    │  localhost:54321    │               │
│                    │  ┌───────────────┐  │               │
│                    │  │ Edge Function │──┼───┐           │
│                    │  │analyze-resume │  │   │           │
│                    │  └───────────────┘  │   │           │
│                    └─────────────────────┘   │           │
│                                              ▼           │
│                              ┌───────────────────┐       │
│                              │      Ollama       │       │
│                              │ localhost:11434   │       │
│                              │    llama3.2       │       │
│                              └───────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

---

## Troubleshooting (Local Setup)

### "Connection refused" to Ollama

1. Check Ollama is running:
   ```bash
   curl http://localhost:11434/api/version
   ```

2. For Docker-based Supabase, use:
   ```env
   OLLAMA_URL=http://host.docker.internal:11434
   ```

3. Check firewall isn't blocking port 11434

### "Model not found"

```bash
ollama pull llama3.2
```

### Slow First Response

- First request loads model into memory (~30s)
- Subsequent requests are faster (~5-15s)

### Out of Memory

Use smaller model:
```bash
ollama pull phi3  # Only 2GB
```

---

## Option 2: Cloud Deployment

### Prerequisites

1. **Node.js** (v18+)
2. **Supabase Account** - [supabase.com](https://supabase.com)
3. **Google AI API Key** - [Google AI Studio](https://aistudio.google.com/apikey)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Set project name and password
4. Choose region closest to your users
5. Wait for project creation

### Step 2: Get Supabase Credentials

Go to **Settings** → **API** and copy:
- **Project URL** (e.g., `https://xxxxx.supabase.co`)
- **Anon Key**
- **Project Reference ID**

### Step 3: Configure Environment

Create `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

### Step 4: Deploy Edge Function

```bash
# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Add secrets
supabase secrets set USE_LOCAL_OLLAMA=false
supabase secrets set GEMINI_API_KEY=your_google_ai_api_key

# Deploy
supabase functions deploy analyze-resume
```

### Step 5: Deploy Frontend to Vercel

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

---

## AI Provider Priority

The edge function tries providers in this order:

| Priority | Provider | When Used |
|----------|----------|-----------|
| 1 | Ollama | `USE_LOCAL_OLLAMA=true` |
| 2 | Lovable AI | `LOVABLE_API_KEY` exists (auto in Lovable Cloud) |
| 3 | Gemini | `GEMINI_API_KEY` or `GOOGLE_AI_API_KEY` exists |

---

## Common Issues

### "GOOGLE_AI_API_KEY is not configured"
```bash
supabase secrets set GOOGLE_AI_API_KEY=your_key
supabase functions deploy analyze-resume
```

### "API key blocked" / 403 errors
→ Use Ollama local setup instead (Option 1)

### CORS Errors
→ Edge function has CORS configured; verify correct Supabase URL

### "Failed to invoke function"
```bash
supabase functions list
supabase functions logs analyze-resume
```

---

## Project Structure

```
├── src/                        # Frontend React app
├── supabase/
│   ├── config.toml             # Supabase config
│   ├── .env.local.example      # Local env template
│   └── functions/
│       └── analyze-resume/     # AI edge function
├── .env.example                # Env template
└── DEPLOYMENT.md               # This file
```
