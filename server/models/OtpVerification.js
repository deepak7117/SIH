import mongoose from 'mongoose';

const otpVerificationSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // document automatically deleted after 10 minutes (600 seconds)
    },
  }
);

const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
export default OtpVerification;
