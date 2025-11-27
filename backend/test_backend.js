import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_URL = 'http://localhost:5000/api/v1/user/register';

const testRegisterWithImage = async () => {
    console.log('\n--- Testing Registration WITH Image ---');
    try {
        const form = new FormData();
        form.append('username', 'testuser_img_' + Date.now());
        form.append('email', 'test_img_' + Date.now() + '@example.com');
        form.append('password', 'password123');
        form.append('bio', 'Test bio with image');
        form.append('avatar', fs.createReadStream('./real_image.png'));

        const response = await axios.post(API_URL, form, {
            headers: {
                ...form.getHeaders()
            }
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error Details:', error.response ? error.response.data : error.message);
        if (error.response) console.error('Status:', error.response.status);
        console.error('Stack:', error.stack);
    }
};

const runTests = async () => {
    await testRegisterWithImage();
};

runTests();
