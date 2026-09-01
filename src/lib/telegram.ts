// Telegram bot notification for new orders.
// Configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.
// Sends "New order" message to the admin. No-ops quietly when unconfigured.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendOrderNotification(payload: {
  orderId: string;
  customerName: string;
  phone: string;
  productName: string;
  price: number;
  paymentMethod: string;
  address: string;
}) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn(
      "[telegram] NOT configured — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to enable notifications.",
    );
    return;
  }

  const text = [
    "🛍️ *طلب جديد — Crave*",
    "",
    `📦 المنتج: ${payload.productName}`,
    `👤 الاسم: ${payload.customerName}`,
    `📞 التليفون: ${payload.phone}`,
    `📍 العنوان: ${payload.address}`,
    `💳 طريقة الدفع: ${payload.paymentMethod}`,
    `💰 السعر: ${payload.price} ج.م`,
    `🆔 رقم الطلب: ${payload.orderId}`,
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      },
    );
    if (!res.ok) {
      console.error(
        "[telegram] send failed",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("[telegram] error", err);
  }
}
