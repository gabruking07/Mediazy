import { brand } from "@/shared/brand";

type EmailTemplate = {
  subject: string;
  html: string;
  text: string;
};

export function createWelcomeEmail(name: string): EmailTemplate {
  const displayName = name.trim() || "there";

  return {
    subject: "Welcome to Mediazy",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;color:#0F172A;line-height:1.6">
        <h1>Welcome to Mediazy</h1>
        <p>Hi ${escapeHtml(displayName)}, your Mediazy workspace is ready.</p>
        <p>Mediazy is a product created and owned by KenoraTech.</p>
        <p style="margin-top:32px;color:#64748B;font-size:12px">${brand.emailFooter}</p>
      </div>
    `,
    text: `Hi ${displayName}, your Mediazy workspace is ready.\n\nMediazy is a product created and owned by KenoraTech.\n\n${brand.emailFooter}`
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}
