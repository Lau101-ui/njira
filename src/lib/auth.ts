import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { prisma } from "@/server/db";
import { sendAuthEmail } from "@/lib/email";

const appUrl = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;
const emailDeliveryConfigured = Boolean(process.env.RESEND_API_KEY && process.env.AUTH_EMAIL_FROM);
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

if (process.env.NODE_ENV === "production" && !isProductionBuild && (!appUrl || !secret)) {
  throw new Error("BETTER_AUTH_URL and BETTER_AUTH_SECRET must be configured in production.");
}

function dispatchAuthEmail(message: Parameters<typeof sendAuthEmail>[0]) {
  void sendAuthEmail(message).catch(() => {
    // Do not log email addresses, verification URLs, reset tokens or provider responses.
    console.error("NJIRA transactional email delivery failed.");
  });
}

export const auth = betterAuth({
  appName: "NJIRA",
  baseURL: appUrl,
  secret: secret ?? (isProductionBuild ? "build-only-secret-not-valid-at-runtime" : undefined),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: appUrl ? [appUrl] : ["http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: !emailDeliveryConfigured,
    requireEmailVerification: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => dispatchAuthEmail({
      to: user.email, subject: "Reset your NJIRA password",
      heading: "Reset your password",
      message: "We received a request to reset your NJIRA password. Use the secure link below. If you did not make this request, ignore this email.",
      actionLabel: "Reset password", actionUrl: url
    })
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    expiresIn: 3600,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => dispatchAuthEmail({
      to: user.email, subject: "Verify your NJIRA email",
      heading: "One step before you begin",
      message: "Confirm that this email address belongs to you to activate your NJIRA account. This link expires in one hour.",
      actionLabel: "Verify email address", actionUrl: url
    })
  },
  session: { expiresIn: 604800, updateAge: 86400, cookieCache: { enabled: false } },
  rateLimit: { enabled: true, window: 60, max: 10 },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
  plugins: [twoFactor({ issuer: "NJIRA" })]
});
