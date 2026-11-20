"use client";
import { FormEvent, useState } from "react";

type Profile = {
  displayName: string;
  headline: string | null;
  bio: string | null;
  city: string | null;
  website: string | null;
  acceptingWork: boolean;
};

export function CreatorProfileEditor({ profile }: { profile: Profile }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice(""); setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      displayName: String(form.get("displayName") ?? "").trim(),
      headline: String(form.get("headline") ?? "").trim(),
      bio: String(form.get("bio") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      website: String(form.get("website") ?? "").trim(),
      acceptingWork: form.get("acceptingWork") === "on"
    };
    try {
      const response = await fetch("/api/profile/creator", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update your profile.");
      setNotice("Profile saved. Your public profile will reflect these changes.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Try again.");
    } finally { setBusy(false); }
  }

  return <section className="workspace-panel profile-editor">
    <p className="eyebrow">02 / YOUR PUBLIC IDENTITY</p>
    <h2>Make it<br/>recognisably <em>you.</em></h2>
    <p className="workspace-copy">These details appear on your public creator profile. Your account email and private information stay hidden.</p>
    <form className="workspace-form" onSubmit={save}>
      <label>Display name<input name="displayName" required minLength={2} maxLength={80} defaultValue={profile.displayName}/></label>
      <label>Professional headline<input name="headline" maxLength={120} defaultValue={profile.headline ?? ""} placeholder="e.g. Filmmaker & visual storyteller"/></label>
      <label>About your work<textarea name="bio" rows={5} maxLength={1200} defaultValue={profile.bio ?? ""} placeholder="Your approach, experience, style and the work you want to create."/></label>
      <label>City<input name="city" maxLength={80} defaultValue={profile.city ?? ""} placeholder="e.g. Lilongwe"/></label>
      <label>Website (HTTPS only)<input name="website" type="url" maxLength={240} defaultValue={profile.website ?? ""} placeholder="https://yourportfolio.com"/></label>
      <label className="profile-availability"><input name="acceptingWork" type="checkbox" defaultChecked={profile.acceptingWork}/> Currently accepting work</label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {notice && <p className="auth-success" role="status">{notice}</p>}
      <button className="auth-submit" disabled={busy}>{busy ? "SAVING PROFILE…" : "SAVE PROFILE"} <span>↗</span></button>
    </form>
  </section>;
}
