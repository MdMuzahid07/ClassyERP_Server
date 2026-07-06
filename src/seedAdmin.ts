/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from './app/config';
import { UserModel } from './app/modules/auth/auth.model';

const seedAdmin = async () => {
  try {
    // Validation
    if (!config.database_url) {
      throw new Error('DATABASE_URL is missing in the configuration.');
    }

    // Connect
    await mongoose.connect(config.database_url);
    console.log('🌱 Database connected for seeding...');

    // Define Credentials
    const adminEmail = process.argv[2] ?? config.admin_email ?? 'mdmuzahid.dev@gmail.com';
    const adminPassword =
      process.argv[3] ?? config.admin_password ?? 'CommandCenter@&$FYDDcj$^%6##@33!@';

    // Check Existence
    const userExists = await UserModel.findOne({
      $or: [{ email: adminEmail }, { role: 'Admin' }],
    });

    if (userExists) {
      console.log('⚠️  Admin already exists. Seeding skipped.');
    } else {
      // Create Admin
      await UserModel.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'Admin',
        isActive: true,
      });

      console.log('✅ Admin created successfully!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: [HIDDEN] (Use the password you defined in env/args)`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    // Graceful Shutdown
    await mongoose.disconnect();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

void seedAdmin();
