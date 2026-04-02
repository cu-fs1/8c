import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || '',
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '13365'),
        connectTimeout: 20000 // Extended timeout
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis successfully');
    } catch (e) {
        console.error('Failed to connect to Redis. Please check your credentials and network connection.', e);
    }
})();

export default client;
