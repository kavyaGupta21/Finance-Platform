import { Resend } from "resend";
import React from "react";
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY || "");
  try {
    const data = await resend.emails.send({
      from: "Finance Platform <onboarding@resend.dev>",
      to,
      subject,
      react,
    });
    return { success: true, data };
  } catch (error) {
    console.error("failed to send email :", error);
    return { success: false, error };
  }
}
