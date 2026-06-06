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

## Submit, client view, and attorney view

**Nothing is transmitted on submit** — this is a client-side app. After the
client submits, they see a plain confirmation that their answers are *not* sent
automatically, with a prominent **Download my responses** button (email the file
to the firm) and a secondary **Print or save as PDF** action, plus a clean
read-only list of their own answers.

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
