"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Mode = "login" | "signup" | "forgot" | "reset";

export function AuthForm({ mode, registrationEnabled = false, resetToken = "" }: { mode: Mode; registrationEnabled?: boolean; resetToken?: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [accountType, setAccountType] = useState<"creator" | "client">("creator");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    try {
      if (mode === "signup") {
        if (!registrationEnabled) throw new Error("Registration is temporarily closed while NJIRA's email delivery is being configured.");
        const password = value("password");
        if (password.length < 12) throw new Error("Use a password with at least 12 characters.");
        const result = await authClient.signUp.email({ name: value("name"), email: value("email").toLowerCase(), password, callbackURL: `${window.location.origin}/onboarding?type=${accountType}` });
        if (result.error) throw new Error(result.error.message);
        window.location.assign("/check-email"); return;
      }
      if (mode === "login") {
        const result = await authClient.signIn.email({ email: value("email").toLowerCase(), password: value("password") });
        if (result.error) throw new Error(result.error.message);
        window.location.assign("/account"); return;
      }
      if (mode === "forgot") {
        const result = await authClient.requestPasswordReset({ email: value("email").toLowerCase(), redirectTo: `${window.location.origin}/reset-password` });
        if (result.error) throw new Error(result.error.message);
        setMessage("If an account exists for that address, a password reset link will be sent."); return;
      }
      const password = value("password");
      if (password.length < 12) throw new Error("Use a password with at least 12 characters.");
      if (password !== value("confirmPassword")) throw new Error("The passwords do not match.");
      if (!resetToken) throw new Error("This reset link is missing or invalid. Request a new one.");
      const result = await authClient.resetPassword({ newPassword: password, token: resetToken });
      if (result.error) throw new Error(result.error.message);
      setMessage("Your password has been changed. You can now sign in.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  }

  const titles: Record<Mode,string> = { login:"Pick up\nwhere you left off.", signup:"Make your\nway forward.", forgot:"Get back\non your path.", reset:"A fresh\nstart." };
  return <main className="auth-shell">
    <section className="auth-aside"><Link className="auth-wordmark" href="/">NJIRA<span>®</span></Link><p className="eyebrow">A CREATIVE ECOSYSTEM / MALAWI → EVERYWHERE</p><h1>{titles[mode].split("\n").map((line,i)=><span key={line}>{i===1?<em>{line}</em>:line}<br/></span>)}</h1><p className="auth-aside-note">A clearer path for creative people, ambitious ideas and the work that connects them.</p><div className="auth-aside-coordinate">13°59′S / 33°47′E — BUILT IN MALAWI</div></section>
    <section className="auth-panel"><div className="auth-panel-top"><span>YOUR NJIRA ACCOUNT</span><Link href="/">← BACK TO NJIRA</Link></div><div className="auth-form-wrap">
      <p className="eyebrow">{mode==="signup"?"CREATE AN ACCOUNT":mode==="login"?"WELCOME BACK":mode==="forgot"?"ACCOUNT RECOVERY":"SECURE YOUR ACCOUNT"}</p>
      <h2>{mode==="signup"?"Start with the basics.":mode==="login"?"Sign in.":mode==="forgot"?"Forgot your password?":"Choose a new password."}</h2>
      <p className="auth-form-intro">{mode==="signup"?"One account opens the door to the NJIRA ecosystem.":mode==="login"?"Sign in to continue to your creative workspace.":mode==="forgot"?"We will send a secure reset link if an account matches the address.":"Use at least 12 characters. Other active sessions will be revoked."}</p>
      {mode==="signup"&&!registrationEnabled&&<div className="auth-notice">Account registration is not open yet. NJIRA is completing transactional email setup so verification and recovery work reliably.</div>}
      {error&&<div className="auth-error" role="alert">{error}</div>}{message&&<div className="auth-success" role="status">{message}</div>}
      <form className="auth-form" onSubmit={submit}>
        {mode==="signup"&&<><label>Full name<input name="name" autoComplete="name" required minLength={2} maxLength={80}/></label><label>I am here as<select value={accountType} onChange={e=>setAccountType(e.target.value as "creator"|"client")}><option value="creator">A creator — I offer creative services</option><option value="client">A client — I hire creative talent</option></select></label></>}
        {mode!=="reset"&&<label>Email address<input name="email" type="email" autoComplete="email" required/></label>}
        {(mode==="login"||mode==="signup")&&<label>Password<input name="password" type="password" autoComplete={mode==="signup"?"new-password":"current-password"} required minLength={mode==="signup"?12:1} maxLength={128}/></label>}
        {mode==="reset"&&<><label>New password<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label><label>Confirm new password<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128}/></label></>}
        <button className="auth-submit" type="submit" disabled={busy||(mode==="signup"&&!registrationEnabled)}>{busy?"PLEASE WAIT…":mode==="signup"?"CREATE ACCOUNT":mode==="login"?"SIGN IN":mode==="forgot"?"SEND RESET LINK":"UPDATE PASSWORD"} <span>↗</span></button>
      </form>
      <div className="auth-form-links">{mode==="login"&&<><Link href="/forgot-password">Forgot password?</Link><span>New to NJIRA? <Link href="/sign-up">Create an account</Link></span></>}{mode==="signup"&&<span>Already have an account? <Link href="/login">Sign in</Link></span>}{(mode==="forgot"||mode==="reset")&&<Link href="/login">Return to sign in</Link>}</div>
      <p className="auth-legal-note">By continuing, you agree to use NJIRA responsibly. Legal terms and privacy information will be presented before public launch.</p>
    </div><footer className="auth-panel-footer"><span>SECURE ACCOUNT ACCESS</span><span>© {new Date().getFullYear()} NJIRA</span></footer></section>
  </main>;
}
