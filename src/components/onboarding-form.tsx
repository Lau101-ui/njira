"use client";
import { FormEvent, useState } from "react";

export function OnboardingForm({ initialType }: { initialType: "creator" | "client" }) {
  const [type,setType]=useState(initialType); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form=new FormData(event.currentTarget);
    const payload={type,displayName:String(form.get("displayName")??"").trim(),handle:String(form.get("handle")??"").trim(),company:String(form.get("company")??"").trim(),city:String(form.get("city")??"").trim()};
    try {
      const response=await fetch("/api/onboarding",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json(); if(!response.ok) throw new Error(result.error??"We could not save your profile.");
      window.location.assign("/account");
    } catch(caught) { setError(caught instanceof Error?caught.message:"Something went wrong. Please try again."); }
    finally { setBusy(false); }
  }
  return <form className="onboarding-form" onSubmit={submit}>
    <div className="account-type-switch"><button type="button" className={type==="creator"?"selected":""} onClick={()=>setType("creator")}>I CREATE</button><button type="button" className={type==="client"?"selected":""} onClick={()=>setType("client")}>I HIRE</button></div>
    <label>{type==="creator"?"Public display name":"Your name or organisation"}<input name="displayName" required minLength={2} maxLength={80} placeholder={type==="creator"?"e.g. Lau Pixels Studio":"e.g. Acme Malawi"}/></label>
    {type==="creator"?<label>Profile handle<input name="handle" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_-]+" placeholder="e.g. laupixels"/><small>3–24 characters. Letters, numbers, underscores and hyphens.</small></label>:<label>Company or organisation (optional)<input name="company" maxLength={100} placeholder="Organisation name"/></label>}
    <label>City in Malawi (optional)<input name="city" maxLength={80} placeholder="e.g. Lilongwe"/></label>
    {error&&<div className="auth-error" role="alert">{error}</div>}
    <button className="auth-submit" type="submit" disabled={busy}>{busy?"SAVING PROFILE…":"COMPLETE SETUP"} <span>↗</span></button>
  </form>;
}
