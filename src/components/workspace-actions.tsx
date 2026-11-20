"use client";
import { FormEvent, useState } from "react";

export function WorkspaceActions({ creator }: { creator: boolean }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>, endpoint: string) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save.");
      setNotice("Saved as a private draft. It is not publicly visible.");
      formElement.reset();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <div className="workspace-actions">
    {creator ? <section className="workspace-panel"><p className="eyebrow">01 / YOUR OFFER</p><h2>Shape a service.</h2><p className="workspace-copy">Create a clear first draft of what you offer. You can review it before any public listing process.</p>
      <form className="workspace-form" onSubmit={e => submit(e, "/api/workspace/listings")}>
        <label>Service title<input name="title" required minLength={4} maxLength={90} placeholder="e.g. Brand film production"/></label>
        <label>Short summary<input name="summary" required minLength={10} maxLength={180} placeholder="What should a client understand immediately?"/></label>
        <label>Full description<textarea name="description" required minLength={30} maxLength={5000} rows={5} placeholder="Describe your process, deliverables and what is included."/></label>
        <label>Starting price (MWK)<input name="price" type="number" min="0" step="0.01" required placeholder="0"/></label>
        {error && <p className="auth-error" role="alert">{error}</p>}{notice && <p className="auth-success" role="status">{notice}</p>}
        <button className="auth-submit" disabled={busy}>{busy ? "SAVING…" : "SAVE SERVICE DRAFT"} <span>↗</span></button>
      </form>
    </section> : <section className="workspace-panel"><p className="eyebrow">01 / YOUR PROJECT</p><h2>Write a brief.</h2><p className="workspace-copy">Explain what you need, the outcome and your budget. This first version stays private until review and publishing controls are ready.</p>
      <form className="workspace-form" onSubmit={e => submit(e, "/api/workspace/briefs")}>
        <label>Project title<input name="title" required minLength={5} maxLength={100} placeholder="e.g. Launch campaign for a new product"/></label>
        <label>Project details<textarea name="description" required minLength={40} maxLength={5000} rows={6} placeholder="Describe the goal, audience, deliverables and timeline."/></label>
        <div className="workspace-budget"><label>Minimum budget (MWK)<input name="budgetMin" type="number" min="0" step="0.01" placeholder="Optional"/></label><label>Maximum budget (MWK)<input name="budgetMax" type="number" min="0" step="0.01" placeholder="Optional"/></label></div>
        {error && <p className="auth-error" role="alert">{error}</p>}{notice && <p className="auth-success" role="status">{notice}</p>}
        <button className="auth-submit" disabled={busy}>{busy ? "SAVING…" : "SAVE BRIEF DRAFT"} <span>↗</span></button>
      </form>
    </section>}
  </div>;
}
