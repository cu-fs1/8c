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
await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)

export default client;
