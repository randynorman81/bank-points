# Parent Email Notifications — One-Time Setup

Publishing a newsletter post already tries to email every parent contact
automatically. It won't actually send anything until you do this setup —
until then, each post will just show "not notified" with a note to come
back here.

This uses a small script running on your own school Google account (via
Google Apps Script, which is free and included with Google Workspace) to
send the emails. No new accounts, no cost, nothing for district IT to
approve — you're just using Google Sheets/Docs' scripting layer, the same
way a mail-merge add-on would.

## 1. Create the script

1. Go to [script.google.com](https://script.google.com) (signed in as your school account) and click **New project**.
2. Delete the placeholder code and paste in this:

```javascript
function doPost(e) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('SECRET');

  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput({ ok: false, error: 'Malformed request' });
  }

  if (!secret || body.secret !== secret) {
    return jsonOutput({ ok: false, error: 'Invalid secret' });
  }

  var emails = Array.isArray(body.emails) ? body.emails : [];
  var title = body.title || 'New Newsletter Post';
  var url = body.url || '';

  var subject = 'New Class Newsletter: ' + title;
  var message =
    'A new update has been posted to the class newsletter:\n\n' +
    title + '\n\n' +
    'Read it here: ' + url + '\n\n' +
    '— Mr. Norman';

  var sent = 0;
  var failed = [];
  emails.forEach(function (email) {
    try {
      MailApp.sendEmail(email, subject, message);
      sent++;
    } catch (err) {
      failed.push(email);
    }
  });

  return jsonOutput({ ok: true, sent: sent, failed: failed });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Name the project something like "Newsletter Notifier" (top left).

## 2. Set the shared secret

This stops random people on the internet from triggering mass emails —
only a request carrying the exact secret you pick is allowed through.

1. In the Apps Script editor, click the gear icon (**Project Settings**) on the left.
2. Scroll to **Script Properties** > **Add script property**.
3. Property: `SECRET`. Value: make up any long random string (e.g. mash the keyboard for 20+ characters). Save it somewhere — you'll need the exact same value in Netlify in step 4.

## 3. Deploy it as a web app

1. Back in the editor, click **Deploy > New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Description: anything. **Execute as:** Me. **Who has access:** Anyone.
   (The secret from step 2 is what actually protects it — "Anyone" just
   means Netlify's server is allowed to reach the URL at all.)
4. Click **Deploy**. The first time, Google will ask you to authorize the
   script to send email as you — review and allow it (it's your own script,
   running under your own account).
5. Copy the **Web app URL** it gives you (ends in `/exec`). You'll need it next.

## 4. Connect it to the site

1. In the Netlify dashboard, go to the site for `computer-sciencenorman.netlify.app` > **Site configuration > Environment variables**.
2. Add two variables:
   - `PARENT_NOTIFY_WEBHOOK_URL` = the Web app URL from step 3
   - `PARENT_NOTIFY_SECRET` = the exact same value you put in Script Properties in step 2
3. Go to **Deploys > Trigger deploy > Deploy site** once so the site picks up the new values.

## 5. Try it

1. Add yourself as a parent contact on `/newsletter-admin.html` (any student name/period, your own email).
2. Publish a test post.
3. You should get an email within a few seconds, and the post should show "parents notified" instead of "not notified."
4. Delete the test contact and test post once confirmed.

## Notes

- Emails go out **individually** to each parent (not one email with everyone
  visible in Bcc), sent from your own school Gmail address.
- A Google Workspace account can send up to 1,500 emails a day through
  Apps Script — far more than one class's parent list needs, even sending
  weekly.
- If a post shows "not notified," the Posts list explains why (hover the
  badge) — usually this setup hasn't been done yet, or the webhook URL/secret
  don't match. Fix it and hit **Resend Notification** on that post; no need
  to republish it.
