# Bank Points

A site for tracking each student's "bank of extra points" by class period, with a form students use to request spending points on an assignment.

This app lives at `/bank/` on this Netlify site — the site's homepage (`/`) is
the separate SCHS Computer Science site (see [CS-SITE-README.md](CS-SITE-README.md)).
They share the same repo and deploy, but are otherwise unrelated.

## How it works

- **The website** (the `bank/` folder) is static HTML/CSS/JS.
- **The data** (roster + point history) lives in **Netlify Blobs**, a small built-in database that comes free with every Netlify site — no Google account, no third-party service, and no district IT approval needed, since it's entirely part of Netlify (which you're already using to host the site).
- **Reads/writes** go through one small **Netlify Function** (`netlify/functions/data.js`) that runs automatically once the site is deployed.
- **The email** to `randy.norman@socialcircleschools.org` (subject `BANK POINTS REQUESTED`) is sent by Netlify's own built-in **Forms** feature whenever a student submits the request form — also free, also no external accounts.

Three pages, all under `bank/`:
- `bank/index.html` — public points board (Name, Earned, Used, Available), grouped by period
- `bank/request.html` — student form to request using points (triggers the email)
- `bank/admin.html` — PIN-protected page where you add/edit/remove students and add or use points

## Why this needs to deploy through GitHub (not drag-and-drop)

The Function uses one small npm package (`@netlify/blobs`). Netlify only installs that automatically when the site is deployed from a connected Git repository — a plain drag-and-drop deploy skips that install step and the Function would fail. So setup takes one extra step (pushing this folder to GitHub), but everything after that is point-and-click in the Netlify dashboard, and you never touch the terminal again.

## One-time setup

### 1. Put this project on GitHub

1. Go to [github.com/new](https://github.com/new) and create a new **private** repository (any name, e.g. `bank-points`). Leave it empty (no README/gitignore).
2. Back in this project folder, push it up. If you're working with someone helping you in a terminal, the commands are:
   ```
   git remote add origin <the URL GitHub gives you>
   git branch -M main
   git push -u origin main
   ```

### 2. Connect it to Netlify

1. In Netlify, click **Add new site > Import an existing project**.
2. Choose GitHub, authorize if asked, and pick this repository.
3. Leave the build settings as-is (this project's `netlify.toml` already tells Netlify the publish folder is the project root and the functions live in `netlify/functions`). Click **Deploy**.

### 3. Set your admin PIN

1. In the Netlify dashboard for this site, go to **Site configuration > Environment variables**.
2. Add a variable named `ADMIN_PIN` with whatever PIN you want to use.
3. Go to **Deploys** and click **Trigger deploy > Deploy site** once so the Function picks up the new value.

(If you skip this, the PIN defaults to `1234` — you can always come back and change it the same way, any time, without touching code.)

### 4. Turn on the email notification

1. Still in the Netlify dashboard: **Site configuration > Forms > Form notifications**.
2. Click **Add notification > Email notification**.
3. Enter `randy.norman@socialcircleschools.org` as the recipient and save.

That's it — no code edits needed for either the PIN or the notification email, so both can be changed anytime from the Netlify dashboard.

### 5. Try it out

1. Open your Netlify site URL, add `/bank/admin.html`, and enter your PIN.
2. Add a student and a class period.
3. Go back to `/bank/index.html` — they should appear.
4. Use "+ Add" to give them points, with an optional note about why.
5. Open `/bank/request.html`, submit a test request for that student, and confirm you get the "BANK POINTS REQUESTED" email.

## Day-to-day use

- **Award points:** Admin page > find the student > **+ Add** > enter amount and (optionally) a short reason.
- **Use points:** After a student emails/requests to spend points (or you decide on your own), go to Admin > find the student > **− Use** > enter the amount. This is a manual step by design — the request form only notifies you, it doesn't deduct points automatically, so you stay in control of what actually gets approved.
- **Recent requests:** The top of the Admin page lists the latest submitted requests. Every submission is also in your Netlify site's **Forms** tab if you ever need the full history or the exact submission time.
- **Add/rename/move/remove students:** all from the Admin page — no code edits needed.
- **Available points** = total earned − total used, calculated automatically.
- **Works on any device** — the points board and admin page pull live from the same backend, so students checking on their own Chromebook see the same numbers you do.

## Notes

- The PIN is a light deterrent, not strong security — anyone who has it can add/remove points. Don't share the admin link/PIN publicly.
- Netlify Forms' free tier includes 100 submissions/month, far more than a single class will generate.
- If you ever want to see the raw data, Netlify Blobs isn't spreadsheet-viewable the way a Google Sheet is — but everything you need day-to-day (totals, history of requests) is already surfaced on the site itself.
