const fromEmail = () => process.env.NOTIFICATION_FROM_EMAIL || 'Mediazy <noreply@mediazy.local>';

export const sendAccountNotification = async ({ to, subject, text }) => {
  if (!to) return;

  if (!process.env.RESEND_API_KEY) {
    console.log(`[email notification] To: ${to} | Subject: ${subject} | ${text}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail(),
      to,
      subject,
      text
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('Email notification failed:', errorText || response.statusText);
  }
};
