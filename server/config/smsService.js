/**
 * SMS Service – Fast2SMS (primary) + Twilio (optional) + Console fallback
 */
export const sendSMS = async (phone, otp) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10); // last 10 digits
  const message = `Your BhavinShinde Incredible India Tourism verification OTP is ${otp}. Valid for 10 minutes. Do not share.`;

  console.log(`\n========================================`);
  console.log(`📱 [SMS SERVICE] Target: +91${cleanPhone}`);
  console.log(`🔑 OTP: ${otp}`);
  console.log(`========================================\n`);

  // ---------- Fast2SMS (recommended for India) ----------
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: cleanPhone,
        }),
      });

      const data = await response.json();
      console.log('Fast2SMS Response:', data);

      if (data.return === true || data.status_code === 200) {
        return { success: true, provider: 'fast2sms', data };
      } else {
        console.error('Fast2SMS failed:', data);
        // fall through to console / Twilio
      }
    } catch (error) {
      console.error('Fast2SMS error:', error.message);
    }
  }

  // ---------- Twilio (optional – good for international) ----------
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  ) {
    try {
      const auth = Buffer.from(
        `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
      ).toString('base64');

      const params = new URLSearchParams();
      params.append('To', `+91${cleanPhone}`);
      params.append('From', process.env.TWILIO_PHONE_NUMBER);
      params.append('Body', message);

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        }
      );

      const data = await res.json();
      console.log('Twilio Response:', data);
      return { success: true, provider: 'twilio', data };
    } catch (err) {
      console.error('Twilio error:', err.message);
    }
  }

  // Fallback – only console (current behaviour)
  console.log('⚠️ No SMS provider configured. OTP is only in the server console.');
  return { success: true, provider: 'console', otp };
};