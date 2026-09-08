// Lightweight, robust email sender utilizing Resend API via standard node-fetch (with graceful fallback)

const RESEND_API_KEY: string = "re_dgRtHGcT_BrkKM9nhvHE5y1UdAxUFfSPm";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!RESEND_API_KEY || RESEND_API_KEY === "MY_RESEND_API_KEY") {
    console.log(`[Email Mock (No Key)] To: ${to} | Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Belmont Stats <onboarding@resend.dev>", // Resend Sandbox Sender
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Resend API Error: ${errText}`);
      return { success: false, error: errText };
    }

    const data = await response.json();
    console.log(`Email successfully delivered via Resend:`, data);
    return { success: true, data };
  } catch (err: any) {
    console.error("Resend delivery crashed:", err);
    return { success: false, error: err.message };
  }
}

// Styled Wrapper in Belmont branding colors (Navy: #0A1F44, Maroon: #6B0F1A)
export function getBelmontEmailTemplate(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { background-color: #0A1F44; padding: 30px; text-align: center; border-bottom: 4px solid #6B0F1A; }
        .title { color: #ffffff; font-size: 26px; font-weight: bold; margin: 10px 0 0 0; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #2d3748; line-height: 1.6; font-size: 16px; }
        .footer { background-color: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #6B0F1A; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; text-transform: uppercase; font-size: 14px; }
        .highlight { color: #6B0F1A; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <!-- Scalable Text branding mimicking our Marauder identity -->
          <div style="font-size: 40px; color: white; font-weight: 900; line-height: 1;">B</div>
          <h1 class="title">Belmont Stats</h1>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Belmont Varsity Stats Club. All rights reserved.</p>
          <p>Belmont High School, Home of the Belmont Marauders</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
