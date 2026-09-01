"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/telegram";

const orderSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().min(3),
  paymentMethod: z.enum(["COD", "VODAFONE_CASH", "INSTAPAY"]),
  notes: z.string().optional().default(""),
});

export type OrderFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    customerName?: string[];
    phone?: string[];
    address?: string[];
    paymentMethod?: string[];
    productId?: string[];
  };
} | undefined;

export async function submitOrder(
  state: OrderFormState,
  formData: FormData,
): Promise<OrderFormState> {
  const parsed = orderSchema.safeParse({
    productId: formData.get("productId"),
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    paymentMethod: formData.get("paymentMethod"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { productId, customerName, phone, address, paymentMethod, notes } =
    parsed.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return { message: "orderForm.error" };
    }

    const order = await prisma.order.create({
      data: {
        productId,
        customerName,
        phone,
        address,
        paymentMethod,
        notes: notes || undefined,
      },
    });

    await prisma.notification.create({
      data: {
        message: `طلب جديد #${order.id.slice(0, 6)} — ${customerName} — ${product.nameAr}`,
      },
    });

    await sendOrderNotification({
      orderId: order.id.slice(0, 8),
      customerName,
      phone,
      productName: `${product.nameAr} / ${product.nameEn}`,
      price: product.price,
      paymentMethod,
      address,
    });

    return { success: true };
  } catch (err) {
    console.error("submitOrder", err);
    return { message: "orderForm.error" };
  }
}
