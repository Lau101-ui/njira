import { Resend } from "resend";

type AuthEmail = { to: string; subject: string; heading: string; message: string; actionLabel: string; actionUrl: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character] ?? character);
}

export async function sendAuthEmail(email: AuthEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Transactional email is not configured.");

  const { error } = await new Resend(apiKey).emails.send({
    from, to: [email.to], subject: email.subject,
    text: `${email.heading}\n\n${email.message}\n\n${email.actionLabel}: ${email.actionUrl}\n\nIf you did not request this, ignore this message.`,
    html: `<!doctype html><html><body style="margin:0;background:#f2f0e8;padding:36px 16px;font-family:Arial,sans-serif;color:#102326"><main style="max-width:560px;margin:0 auto;background:#fff;padding:40px 32px;border:1px solid #e5e1d5"><p style="font-size:12px;letter-spacing:3px;font-weight:bold">NJIRA</p><h1 style="font-size:30px;line-height:1.15">${escapeHtml(email.heading)}</h1><p style="font-size:15px;line-height:1.8;color:#52665e">${escapeHtml(email.message)}</p><p style="margin:32px 0"><a href="${escapeHtml(email.actionUrl)}" style="display:inline-block;background:#102326;color:#f2f0e8;padding:15px 22px;text-decoration:none;font-size:13px">${escapeHtml(email.actionLabel)}</a></p><p style="font-size:11px;color:#89968f;margin-top:36px">Built in Malawi. Open to the world.</p></main></body></html>`
  });
  if (error) throw new Error("Transactional email provider rejected the message.");
}
