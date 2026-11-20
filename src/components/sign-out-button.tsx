"use client";
import { authClient } from "@/lib/auth-client";
export function SignOutButton() {
  return <button className="account-signout" onClick={async()=>{await authClient.signOut();window.location.assign("/");}}>SIGN OUT ↗</button>;
}
