import "server-only";
import { prisma } from "@/lib/prisma";

// SiteSetting keys for payment transfer numbers (editable from the dashboard).
export const PAYMENT_VODAFONE_KEY = "payment_vodafone_number";
export const PAYMENT_INSTAPAY_KEY = "payment_instapay_number";

// Default fallback numbers (used until the admin edits them in the dashboard).
export const DEFAULT_VODAFONE_NUMBER = "01000000000";
export const DEFAULT_INSTAPAY_NUMBER = "example@instapay";

export async function getPaymentConfig() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [PAYMENT_VODAFONE_KEY, PAYMENT_INSTAPAY_KEY] } },
  });
  const map = new Map(settings.map((s) => [s.key, s.value]));

  return {
    vodafoneNumber:
      map.get(PAYMENT_VODAFONE_KEY) ||
      process.env.PAYMENT_VODAFONE_NUMBER ||
      DEFAULT_VODAFONE_NUMBER,
    instapayNumber:
      map.get(PAYMENT_INSTAPAY_KEY) ||
      process.env.PAYMENT_INSTAPAY_NUMBER ||
      DEFAULT_INSTAPAY_NUMBER,
  };
}

// Save a payment number setting (used by the dashboard settings action).
export async function setPaymentSetting(key: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    await prisma.siteSetting.delete({ where: { key } }).catch(() => {});
    return;
  }
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: trimmed },
    create: { key, value: trimmed },
  });
}

// Return the raw stored values (or null) for editing in the dashboard.
// Falls back to env vars, then to defaults, so the form is never empty.
export async function getStoredPaymentSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [PAYMENT_VODAFONE_KEY, PAYMENT_INSTAPAY_KEY] } },
  });
  const map = new Map(settings.map((s) => [s.key, s.value]));

  const storedVodafone =
    map.get(PAYMENT_VODAFONE_KEY) ??
    process.env.PAYMENT_VODAFONE_NUMBER ??
    DEFAULT_VODAFONE_NUMBER;
  const storedInstapay =
    map.get(PAYMENT_INSTAPAY_KEY) ??
    process.env.PAYMENT_INSTAPAY_NUMBER ??
    DEFAULT_INSTAPAY_NUMBER;

  return {
    vodafone: storedVodafone,
    instapay: storedInstapay,
  };
}
