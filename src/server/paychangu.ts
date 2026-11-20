import { createHmac, timingSafeEqual } from "node:crypto";

const API_BASE_URL =
  process.env.PAYCHANGU_API_BASE_URL ?? "https://api.paychangu.com";

type Currency = "MWK" | "USD";

export interface CreateCheckoutInput {
  txRef: string;
  amount: string;
  currency: Currency;
  email?: string;
  firstName?: string;
  lastName?: string;
  callbackUrl: string;
  returnUrl: string;
  title: string;
  description: string;
  meta?: Record<string, string>;
}

interface PayChanguCheckoutResponse {
  status?: string;
  message?: string;
  data?: {
    checkout_url?: string;
    data?: {
      tx_ref?: string;
      amount?: number | string;
      currency?: string;
      status?: string;
    };
  };
}

export interface VerifiedPayChanguPayment {
  tx_ref: string;
  status: string;
  currency: string;
  amount: number | string;
  reference?: string;
  [key: string]: unknown;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

function toMinorUnits(value: string | number): bigint {
  const normalized = String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new Error("Invalid monetary amount");
  }
  const [whole, fraction = ""] = normalized.split(".");
  return BigInt(whole) * 100n + BigInt((fraction + "00").slice(0, 2));
}

/**
 * Creates a PayChangu-hosted checkout session.
 * Call only from a trusted server route after loading the order and amount
 * from the database. Never pass browser-calculated totals directly here.
 */
export async function createPayChanguCheckout(
  input: CreateCheckoutInput,
): Promise<{ checkoutUrl: string; txRef: string }> {
  if (!input.txRef || input.txRef.length > 100) {
    throw new Error("A unique transaction reference is required");
  }
  if (!/^\\d+$/.test(input.amount) || Number(input.amount) <= 0 || Number(input.amount) > 2147483647) {
    throw new Error("PayChangu amount must be a positive int32 in the selected currency");
  }

  const response = await fetch(`${API_BASE_URL}/payment`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${requiredEnv("PAYCHANGU_SECRET_KEY")}`,
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: input.currency,
      tx_ref: input.txRef,
      email: input.email,
      first_name: input.firstName,
      last_name: input.lastName,
      callback_url: input.callbackUrl,
      return_url: input.returnUrl,
      customization: {
        title: input.title,
        description: input.description,
      },
      meta: input.meta,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as PayChanguCheckoutResponse;
  const checkoutUrl = payload.data?.checkout_url;
  const returnedRef = payload.data?.data?.tx_ref;

  if (!response.ok || payload.status !== "success" || !checkoutUrl) {
    throw new Error(
      `PayChangu checkout creation failed: ${payload.message ?? response.statusText}`,
    );
  }
  if (returnedRef && returnedRef !== input.txRef) {
    throw new Error("PayChangu returned a transaction reference mismatch");
  }

  const parsedUrl = new URL(checkoutUrl);
  if (
    parsedUrl.protocol !== "https:" ||
    !["checkout.paychangu.com", "test-checkout.paychangu.com"].includes(
      parsedUrl.hostname,
    )
  ) {
    throw new Error("PayChangu returned an unexpected checkout URL");
  }

  return { checkoutUrl: parsedUrl.toString(), txRef: input.txRef };
}

/**
 * Verifies a transaction server-to-server. A browser redirect or webhook
 * payload alone must never be treated as payment confirmation.
 */
export async function verifyPayChanguTransaction(
  txRef: string,
): Promise<VerifiedPayChanguPayment> {
  if (!txRef || txRef.length > 100) throw new Error("Invalid transaction reference");

  const response = await fetch(
    `${API_BASE_URL}/verify-payment/${encodeURIComponent(txRef)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${requiredEnv("PAYCHANGU_SECRET_KEY")}`,
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as {
    status?: string;
    message?: string;
    data?: VerifiedPayChanguPayment;
  };

  if (!response.ok || payload.status !== "success" || !payload.data) {
    throw new Error(
      `PayChangu verification failed: ${payload.message ?? response.statusText}`,
    );
  }
  if (payload.data.tx_ref !== txRef) {
    throw new Error("Verified transaction reference does not match");
  }
  return payload.data;
}

/**
 * Validate the PayChangu webhook Signature header against the exact raw
 * request body. Pass raw bytes before JSON parsing. Returns false on any
 * malformed or missing signature.
 */
export function verifyPayChanguWebhookSignature(
  rawBody: Uint8Array,
  signature: string | null,
): boolean {
  if (!signature) return false;

  let secret: string;
  try {
    secret = requiredEnv("PAYCHANGU_WEBHOOK_SECRET");
  } catch {
    return false;
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest();
  let received: Buffer;
  try {
    received = Buffer.from(signature.trim(), "hex");
  } catch {
    return false;
  }

  return received.length === expected.length && timingSafeEqual(received, expected);
}

/**
 * Guard used after provider verification and before settling an order.
 * Amounts are compared as integer minor units to avoid floating-point errors.
 */
export function assertVerifiedPaymentMatches(input: {
  payment: { txRef: string; amount: string; currency: string };
  verified: VerifiedPayChanguPayment;
}): void {
  const { payment, verified } = input;
  if (verified.tx_ref !== payment.txRef) {
    throw new Error("Payment reference mismatch");
  }
  if (String(verified.status).toLowerCase() !== "success") {
    throw new Error("PayChangu has not confirmed a successful payment");
  }
  if (String(verified.currency).toUpperCase() !== payment.currency.toUpperCase()) {
    throw new Error("Payment currency mismatch");
  }
  if (toMinorUnits(verified.amount) < toMinorUnits(payment.amount)) {
    throw new Error("Verified payment amount is below the order amount");
  }
}
