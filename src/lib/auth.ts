import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "@/server/db";

const appUrl = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

if (process.env.NODE_ENV === "production" && !isProductionBuild && (!appUrl || !secret)) {
  throw new Error("BETTER_AUTH_URL and BETTER_AUTH_SECRET must be configured in production.");
}

export const auth = betterAuth({
  appName: "NJIRA",
  baseURL: appUrl,
  secret: secret ?? (isProductionBuild ? "build-only-secret-not-valid-at-runtime" : undefined),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: appUrl ? [appUrl] : ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async () => {
      throw new Error("NJIRA email delivery is not configured. Account registration remains closed.");
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false }
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production"
  },
  plugins: [twoFactor({ issuer: "NJIRA" })]
});
