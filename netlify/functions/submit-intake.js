// Netlify Function: emails a completed estate planning intake to the firm via Resend.
//
// PRIVACY: This handles privileged client intake. Never console.log the request
// body or any field values. Secrets are read from the environment only.
const { Resend } = require("resend");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { clientName, refCode, summaryText, flags, fullState } = JSON.parse(event.body || "{}");

    if (!fullState) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing data" }) };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.INTAKE_TO_EMAIL;
    const from = process.env.INTAKE_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      // Configuration problem — do not leak which value is missing.
      console.error("submit-intake error: missing email configuration");
      return { statusCode: 500, body: JSON.stringify({ error: "Send failed" }) };
    }

    const resend = new Resend(apiKey);

    const flagLines =
      Array.isArray(flags) && flags.length ? flags.map((f) => "- " + f).join("\n") : "None raised.";

    const text =
      "New estate planning intake submitted.\n\n" +
      "Client: " + (clientName || "Not given") + "\n" +
      "Reference: " + (refCode || "n/a") + "\n" +
      "Submitted: " + new Date().toISOString() + "\n\n" +
      "FLAGS FOR ATTORNEY REVIEW\n" +
      flagLines + "\n\n" +
      "FULL SUMMARY\n" +
      (summaryText || "(see attached JSON)");

    const attachment = Buffer.from(JSON.stringify(fullState, null, 2)).toString("base64");

    const { error } = await resend.emails.send({
      from: "Prime Legal Intake <" + from + ">",
      to: [to],
      subject: "Estate intake: " + (clientName || "New client") + " (" + (refCode || "") + ")",
      text,
      attachments: [
        {
          filename: "estate-intake-" + (refCode || "submission") + ".json",
          content: attachment,
        },
      ],
    });

    if (error) {
      // Resend returns an error object rather than throwing on API errors.
      console.error("submit-intake error: resend send failed");
      return { statusCode: 500, body: JSON.stringify({ error: "Send failed" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("submit-intake error:", err && err.message ? err.message : "unknown");
    return { statusCode: 500, body: JSON.stringify({ error: "Send failed" }) };
  }
};
