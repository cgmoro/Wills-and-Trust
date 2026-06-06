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

## Attorney summary

On submit, the app renders a printable summary grouped by section (hidden and
empty optional fields are skipped), with the review-flags box at the top. Use
**Print or save as PDF** (browser print dialog) or **Download JSON**.

## ⚠️ Data-security note (read before going live)

This is a low-friction **first draft**. A purely client-side app that stores
answers in the browser or a downloaded JSON file is **not a secure system of
record** for sensitive data (SSNs, account references, financial values).

The SSN field (P9) is intentionally **optional and collapsed**, with a privacy
note, so it is easy to skip and provide later through a secure channel.

Before production use, do one of:

1. **Don't collect** SSNs / exact account numbers in intake; gather them later
   over an encrypted channel.
2. If you do collect sensitive fields, move storage to a **server with
   encryption at rest, transport security, access controls, and a retention
   policy**.
3. Keep a short **privacy note** near any sensitive field.

## Accessibility

Labeled fields, keyboard navigation, high-contrast colors, and a mobile-first
layout (many clients will complete this on a phone).
