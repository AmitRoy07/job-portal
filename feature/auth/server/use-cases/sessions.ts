
import { headers } from 'next/headers';
import crypto from 'crypto';
import { getClientIp } from './location';
import { db } from '@/config/db';
import { sessions } from '@/drizzle/schema';
import { SESSION_LIFETIME } from '@/config/constant';

type CreateUserSessionParams = {
    token: string;
    userId: number;
    ip: string;
    userAgent: string;
}

// Generate a random session token that can be safely stored in the user's cookie.
const generateSessionToken = () => {
    return crypto.randomBytes(32).toString('hex');
}


const createUserSession = async ({token, userId, ip, userAgent}: CreateUserSessionParams) => {
    // Store only a hash of the token in the database, not the raw cookie value.
    const hashToken = crypto.createHash('sha-256').update(token).digest('hex');

    const [result] = await 
    db.insert(sessions).values({
        id: hashToken, 
        userId, 
        userAgent, 
        ip, 
        // Convert the configured lifetime from seconds to milliseconds.
        expireAt: new Date(Date.now() + SESSION_LIFETIME * 1000)});

        return result;
}

export const createSessionAndSetCookie = async (userId: number) => {
    // Create the token and collect request details used for session tracking.
    const token = generateSessionToken();
    const ip = await getClientIp();
    const headerList = await headers();

    await createUserSession({
        token, 
        userId, 
        ip, 
        // Keep a fallback in case the browser or client does not send a user-agent.
        userAgent: headerList.get('user-agent') || 'unknown',
    });

}
