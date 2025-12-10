# Interview task

Welcome! This repo has everything you need to get started. We'll be building a multilingual blog with Directus as the CMS and Astro for the frontend.

Don't stress – we're here to see how you work and think, not to trick you. Feel free to ask questions, use Google, or lean on AI if that's your thing.

## Getting started

### 1. Clone and setup

```bash
git clone <repo-url>
cd interview
chmod +x setup.sh
./setup.sh
```

> **Windows**: Use Git Bash, WSL, or MSYS2 to run the setup script.

The script will generate passwords and configure everything for you.

### 2. Start the services

```bash
docker compose up -d
```

This spins up:
- **Directus** – headless CMS at `http://localhost:8055`
- **PostgreSQL** – database
- **KeyDB** – Redis-compatible cache
- **MinIO** – file storage
- **MailHog** – email testing
- **Backend** – mock blog API at `http://localhost:8000`

### 3. Run the frontend

```bash
cd fe
pnpm install
pnpm dev
```

The Astro dev server will be at `http://localhost:4321`.

---

## The task

We have roughly **2 hours** together. Here's what we'd like you to build:

### Part 1: Directus setup

Create a blog structure in Directus that supports translations. You'll need:
- An **articles** collection
- A way to store **translations** with: `slug`, `title`, and `content` (JSON blocks)

The goal is to be able to query an article by slug and language.

### Part 2: Frontend

Head to the frontend (`fe/`) and check out `src/pages/index.astro` – it has more details on what to build.

In short:
- Add directus SDK to the frontend
- Create a dynamic route like `[locale]/[slug]`
- Fetch the article from Directus based on the URL
- Build a **block renderer** that turns the JSON content into HTML

The content uses [Editor.js](https://editorjs.io/) block format. Handle the common types: paragraphs, headers, lists, images, quotes, code blocks.

### Nice to have (only if time allows)

- A page listing all posts, maybe with pagination
- Good use of the design tokens in `tokens.scss`
- Clean components and CSS structure (we like BEM, but use what you're comfortable with)
- We don't like react, but we have to use it, so you can use it. Just know that components must be SSR renderable.

---

## Bonus round (if we have time)

There's a mock blog API in the `be/` folder. If we finish early, we might:`)
- Write a small migration script to fetch posts from the mock API and import them into Directus

Check `be/README.md` for the API docs. It should already be running in docker.

---

## Things we might chat about

No pressure to bring these up, but if they come naturally:
- How would you index the database for fast slug lookups?
- Where might caching help if this were a high-traffic site?
- Any thoughts on scaling things horizontally? What would be your approach for FE? BE? DB? What about psql replication triggers (For context we use them), how would you handle them in a multi-node setup?

---

## Project structure

```
/fe          – Astro frontend
/be          – Deno mock API
/docker      – Docker service configs
/extensions  – Directus extensions (if needed you can install them here or from directus marketplace directly)
```

---

That's it! Let us know when you're ready to start. Good luck, and have fun with it.


## Good luck! And congrats if you found this before the interview! Nice research job :grin: