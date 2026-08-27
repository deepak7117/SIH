import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import readline from 'readline';
import Admin from '../models/Admin.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminInteractively = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    console.log('🔐 Interactive Admin Setup (No secrets in code files)');
    const name = await askQuestion('Enter Admin Name: ');
    const email = await askQuestion('Enter Admin Email: ');
    const password = await askQuestion('Enter Admin Password: ');

    if (!email || !password) {
      console.log('❌ Email and password cannot be empty.');
      process.exit(1);
    }

    const targetEmail = email.toLowerCase().trim();

    // Check if admin exists to update instead of erroring out
    const existingAdmin = await Admin.findOne({ email: targetEmail });
    if (existingAdmin) {
      console.log(`\nℹ️ Admin "${targetEmail}" already exists. Updating password...`);
      existingAdmin.name = name || existingAdmin.name;
      existingAdmin.password = password; // pre-save hook will encrypt this password
      await existingAdmin.save();
      console.log(`✨ Admin "${targetEmail}" password updated and encrypted successfully in MongoDB!`);
    } else {
      await Admin.create({
        name: name || 'Municipal Admin',
        email: targetEmail,
        password: password, // pre-save hook will encrypt this password
      });
      console.log(`\n✨ Admin "${targetEmail}" created & encrypted into MongoDB successfully!`);
    }

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    rl.close();
    process.exit(1);
  }
};

createAdminInteractively();
