import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB Connection Error in Seed Script:', err);
        process.exit(1);
    });

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('admin123', 12);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin user created successfully');
        console.log('Username: admin');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
