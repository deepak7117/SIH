/**
 * SMS Service module.
 * Supports:
 * 1. Live SMS API gateways (e.g., Twilio, Fast2SMS) via environment variables
 * 2. Instant Simulator & console logger for immediate zero-config testing
 */

export const sendSMS = async (phone, otp) => {
  const message = `Your BhavinShinde Incredible India Tourism verification OTP code is: ${otp}. Valid for 10 minutes.`;

  console.log(`\n========================================`);
  console.log(`📱 [SMS SERVICE] Sending SMS to: ${phone}`);
  console.log(`💬 Message: "${message}"`);
  console.log(`🔑 Verification OTP: >>> [ ${otp} ] <<<`);
  console.log(`========================================\n`);

  // Optional: Fast2SMS integration if API key is provided
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
          numbers: phone.replace(/[^0-9]/g, ''),
        }),
      });
      const data = await response.json();
      console.log('Fast2SMS Response:', data);
    } catch (error) {
      console.error('Fast2SMS delivery error:', error.message);
    }
  }

  // Optional: Twilio integration if credentials are provided
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      // Basic Twilio REST API invocation without mandatory heavy external SDK
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', phone.startsWith('+') ? phone : `+91${phone}`);
      params.append('From', process.env.TWILIO_PHONE_NUMBER);
      params.append('Body', message);

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
    } catch (err) {
      console.error('Twilio SMS delivery error:', err.message);
    }
  }

  return { success: true, otp };
};
