"use server";

import { cookies } from "next/headers";

export async function verifyGatePassword(
  password: string
): Promise<{ success: boolean; error?: string }> {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return { success: true };
  }

  if (password !== sitePassword) {
    return { success: false, error: "Wrong password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("site-auth", sitePassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return { success: true };
}
