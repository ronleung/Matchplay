# Match Play — Setup Guide

## 1. Try Demo Mode (No Setup Required)

Just open `index.html` in a browser and click **"Try Demo Mode"**. Everything works offline with sample data.

## 2. Supabase Setup (For Real Auth, Matching & Chat)

### 2a. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project**
3. Choose an org, name it `match-play`, set a database password, pick a region close to your users
4. Wait ~2 minutes for provisioning

### 2b. Get Your Credentials

1. Go to **Settings → API**
2. Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`)
3. Copy **anon / public** key (starts with `eyJ...`)

### 2c. Add Credentials to the App

Open `index.html` and find this block near the top of the `<script>`:

```js
const SUPABASE_URL = '';
const SUPABASE_KEY = '';
```

Paste your values there.

### 2d. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire SQL block from the bottom of `index.html` (inside the `<!-- SUPABASE SCHEMA` comment)
4. Paste it into the SQL editor and click **Run**

This creates all tables, views, RLS policies, and enables Realtime.

### 2e. Enable Realtime

1. Go to **Database → Replication**
2. Under "Realtime", make sure the `messages` table has Realtime enabled
3. (The SQL script attempts to do this automatically, but verify it here)

### 2f. Enable Email Auth

1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled
3. For testing, you can disable "Confirm email" under **Authentication → Settings**

## 3. Deploy Free on Netlify

### Option A: Drag & Drop

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the folder containing `index.html` onto the page
3. Done — you get a live URL instantly

### Option B: Git Deploy

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **New site from Git**
3. Select your repo
4. Build command: _(leave blank)_
5. Publish directory: `.` (or `/` depending on where `index.html` lives)
6. Click **Deploy site**

### Option C: Netlify CLI

```bash
npm i -g netlify-cli
netlify deploy --prod --dir .
```

## 4. Other Free Hosting Options

- **GitHub Pages**: Push to a repo, enable Pages in settings
- **Vercel**: Import the repo at [vercel.com](https://vercel.com)
- **Cloudflare Pages**: Connect your repo at [pages.cloudflare.com](https://pages.cloudflare.com)

All work great since this is a single static HTML file with no build step.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Supabase not configured" toast | Add your URL and anon key to the config block |
| Sign-up doesn't work | Check that Email auth is enabled in Supabase |
| Chat messages don't appear live | Verify Realtime is enabled on the `messages` table |
| RLS errors / empty data | Re-run the full SQL schema in the SQL Editor |
| CORS errors | Make sure you're using the correct Supabase URL |
