import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { handleRouteError } from "../../../lib/api-errors";
import { assertRateLimit, assertTrustedOrigin, getClientIp } from "../../../lib/security";
import {
  escapeHtml,
  parseJsonObject,
  readEmail,
  readOptionalText,
  readText,
} from "../../../lib/validation";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  return apiKey ? new Resend(apiKey) : null;
}

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const body = await parseJsonObject(request);
    await assertRateLimit({
      scope: "contact-form-ip",
      key: getClientIp(request),
      limit: 5,
      windowSeconds: 15 * 60,
      blockSeconds: 30 * 60,
      message: "Too many enquiry requests. Please try again in 30 minutes.",
    });
    const name = readText(body.name, { field: "Name", min: 3, max: 80 });
    const email = readEmail(body.email);
    const whatsapp = readText(body.whatsapp, {
      field: "WhatsApp number",
      min: 10,
      max: 20,
    }).replace(/[^\d+]/g, "");
    const subject = readOptionalText(body.subject, {
      field: "Subject",
      max: 120,
    }) || "Enrollment Enquiry";
    const message = readText(body.message, {
      field: "Message",
      min: 10,
      max: 2000,
      preserveLineBreaks: true,
    });

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json(
        {
          message: "Form received locally. Add RESEND_API_KEY in .env to enable email delivery.",
        },
        { status: 202 },
      );
    }

    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["defactoinstitute07@gmail.com"],
      subject: `New Enrollment Interest: ${escapeHtml(subject)}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #f59e0b;">New Enrollment Interest Received</h2>
          <p>You have a new enquiry from the website enrollment form.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">This email was sent from your website's contact form.</p>
        </div>
      `,
    });

    if (error) {
      throw new Error("Failed to send email.");
    }

    return NextResponse.json({ message: "Enrollment interest sent successfully!", data });
  } catch (error) {
    return handleRouteError(error, "Internal server error. Please try again later.");
  }
}
