import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [twoFactorClient({
    onTwoFactorRedirect() {
      if (typeof window !== "undefined") {
        window.location.assign("/two-factor");
      }
    }
  })]
});
