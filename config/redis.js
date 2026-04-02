import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from './logger.js';

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

client.on('error', err => logger.error('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        logger.info('Connected to Redis');
    } catch (error) {
        logger.error('Failed to connect to Redis', error);
    }
})();

export default client;
