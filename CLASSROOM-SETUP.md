# Google Classroom Integration — One-Time Setup

`/classroom-admin.html` lets you post assignments straight to Google
Classroom. Before it can do anything, it needs its own Google Cloud
credentials — a one-time setup under your own school Google account.

## 1. Create a Google Cloud project and enable the Classroom API

1. Go to [console.cloud.google.com](https://console.cloud.google.com), signed in as your school account.
2. Create a new project (top-left project picker > New Project). Any name is fine, e.g. "SCHS CS Classroom Integration".
3. Go to **APIs & Services > Library**, search **Google Classroom API**, and click **Enable**.

## 2. Configure the OAuth consent screen

1. Go to **APIs & Services > OAuth consent screen**.
2. **User type:** if you see both **Internal** and **External** as options, choose **Internal** — that means your Cloud project is tied to your school's Google Workspace, and Internal apps have no verification requirement and don't expire the way External/Testing apps do. **If you only see External**, pick that and continue — this is the normal path most personal/free Google Cloud setups get.
3. Fill in the required fields (app name, your email) — nothing else matters for this use.
4. Add the scopes: `.../auth/classroom.courses.readonly` and `.../auth/classroom.coursework.students`.
5. Under **Test users** (External only), add your own school email address.
6. Save. If you ended up on **External**, the app stays in **Testing** status — that's fine and expected; it's what makes the "reconnect roughly weekly" behavior described in the app apply. (If you got **Internal** in step 2, none of that applies — it just works indefinitely.)

## 3. Create OAuth credentials

1. Go to **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
2. Application type: **Web application**.
3. Under **Authorized redirect URIs**, add exactly:
   ```
   https://computer-sciencenorman.netlify.app/api/classroom
   ```
4. Create it, then copy the **Client ID** and **Client Secret** it shows you.

## 4. Connect it to the site

1. In the Netlify dashboard, go to the site for `computer-sciencenorman.netlify.app` > **Site configuration > Environment variables**.
2. Add two variables:
   - `CLASSROOM_CLIENT_ID` = the Client ID from step 3
   - `CLASSROOM_CLIENT_SECRET` = the Client Secret from step 3
3. Go to **Deploys > Trigger deploy > Deploy site** once so the function picks up the new values.

## 5. Connect and set up your classes

1. Open `/classroom-admin.html` and enter your admin PIN.
2. Click **Connect Google Classroom** and approve access with your school account.
3. Under **Course Links**, pick which real Google Classroom course each of IST / AP CSP / Embedded Computing should post to, and save.
4. Try posting a test assignment to confirm it shows up correctly in Classroom, then delete the test assignment from Classroom itself.

## Reconnecting

If you picked **External** in step 2 (the common case), Google expires the
connection after about a week. When that happens, `/classroom-admin.html`
will show the connection as broken with a clear error — just click
**Reconnect Google Classroom** and approve again; it takes a few seconds
and nothing else needs to be redone (Course Links stay saved).

If you picked **Internal**, this doesn't apply — you shouldn't need to
reconnect unless you explicitly revoke access.
