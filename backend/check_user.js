import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PostUser } from './src/models/user.model.js';

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await PostUser.findOne({ username: 'testuser' });
        if (user) {
            console.log('User "testuser" exists:', user);
        } else {
            console.log('User "testuser" does not exist');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkUser();
