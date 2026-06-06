# Estate Planning Intake Questionnaire (California)

A single, self-contained web app a client completes on their own. It produces a
clean, printable **attorney-facing summary** at the end, with a **Flags for
Attorney Review** box at the top.

## How to use

Open **`estate-planning-intake.html`** in any modern browser. No server, build
step, or install is required — it loads React and Tailwind from CDNs.

- One section per screen with a progress bar and Back / Next buttons.
- Required fields are validated before advancing.
- Every field has help text and an info icon (tap or hover) with a tooltip.
- Branching logic and derived flags update live as answers change.

## Save and resume

- Answers are saved to the browser (`localStorage`) on every change.
- **Save file** downloads a JSON copy of your progress; **Import file** reloads
  it — use these to move between devices.
- A short **resume code** (e.g. `EP-4F7K`) lets you restore progress on the
  same device.

## What the branching does

- **Married / RDP** reveals spouse fields, the community-property prompt, and
  the "Everything to my spouse" distribution option.
- **Children → Yes** reveals a repeatable child block; any child under 18 sets
  `isMinor`, which reveals the guardian-nomination document, the guardian
  fiduciary role, and the minor-trust questions.
- **Document selections** drive required fiduciary roles (trust → successor
  trustee, DPOA → financial agent, health-care directive → health-care agent
  and reveals the Health Care section).
- Business, real-property, retirement, special-circumstance, and disinheritance
  answers raise plain-language flags in the summary.

Derived flags: `isMinor`, `specialNeedsFlag`, `businessSuccessionFlag`,
`outOfStateFlag`, plus non-citizen-spouse and retirement-beneficiary review.

## Email delivery (Netlify Function + Resend)

On submit, after the full-form validation sweep passes, the client app POSTs the
completed intake to a Netlify Function (`/.netlify/functions/submit-intake`),
which emails the firm a plain-text summary with the structured responses
attached as a JSON file, via [Resend](https://resend.com).

The download-file path is always available as a fallback: if the network call
fails, the client sees a clear message asking them to **Download my responses**
and email the file so nothing is lost.

### Deploy / configuration

Deploy the repo to Netlify (functions live in `netlify/functions`, configured in
`netlify.toml`; `package.json` installs the `resend` dependency at build time).

Set these environment variables in **Netlify → Site settings → Environment
variables** (never commit secrets):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Your Resend API key |
| `INTAKE_TO_EMAIL` | Firm address that receives intakes |
| `INTAKE_FROM_EMAIL` | Verified Resend sender (e.g. `intake@yourfirm.com`) |

The function rejects non-POST requests (405), returns 400 if data is missing,
200 `{ok:true}` on success, and 500 on error. It never logs the request body or
any field values — only a generic error message — because this is privileged
client intake.

## Submit, client view, and attorney view

After the client submits, they see a confirmation (sent, or a download-and-email
fallback if delivery failed) plus a clean read-only list of their own answers.
The internal attorney flag list **travels only inside the email to the firm** and
is never shown on the client confirmation screen.

The internal **Flags for Attorney Review** box is **never shown to the client**.
It renders only in the **attorney view**, which is opt-in via the URL hash:
open the file (or a saved JSON re-imported into it) at
`estate-planning-intake.html#review`. The attorney view shows the full summary
grouped by section (hidden and empty optional fields are skipped) with the
flags box at the top.

## ⚠️ Data-security note

This is a low-friction client-side app. Answers stored in the browser or a
downloaded JSON file are **not a secure system of record** for sensitive data.

- The intake **does not collect Social Security numbers** at all. A note tells
  the client the firm will request an SSN later through a secure channel if
  needed.
- Avoid collecting exact account numbers in intake; gather them later over an
  encrypted channel.
- If you later add sensitive fields, move storage to a **server with encryption
  at rest, transport security, access controls, and a retention policy**.

## Accessibility

Labeled fields, keyboard navigation, high-contrast colors, and a mobile-first
layout (many clients will complete this on a phone).
