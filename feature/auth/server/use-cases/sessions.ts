
import { cookies, headers } from 'next/headers';
import crypto from 'crypto';
import { getClientIp } from './location';
import { db } from '@/config/db';
import { sessions, users } from '@/drizzle/schema';
import { SESSION_LIFETIME, SESSION_REFRESH_TIME } from '@/config/constant';
import { eq} from "drizzle-orm";
import { redirect } from 'next/navigation';

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

// Create a new session in the database and return the new session ID.
const createUserSession = async ({token, userId, ip, userAgent}: CreateUserSessionParams) => {
    // Store only a hash of the token in the database, not the raw cookie value.
    const hashToken = crypto.createHash('sha256').update(token).digest('hex');
 
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

    const cookieStore = await cookies();

    cookieStore.set('session', token, 
        {
            secure: true,
            httpOnly: true,
            maxAge: SESSION_LIFETIME,
        }
    )

}



export const validateSessionAndGetUser = async (session: string) => {
    const hashToken = crypto.createHash('sha256').update(session).digest('hex');

    const [user] = await db.select({
        id: users.id,
        session: {
            id: sessions.id,
            expireAt: sessions.expireAt,
            userAgent: sessions.userAgent,
            ip: sessions.ip,
        },
        name: users.name,
        userName: users.userName,
        email: users.email,
        role: users.role,
        phoneNumber: users.phoneNumber,
        createAt: users.createAt,
        updateAt: users.updateAt,
    })
    .from(sessions)
    .where(eq(sessions.id, hashToken))
    .innerJoin(users, eq(sessions.userId, users.id));

    if (!user) {
        return null;
    }

    if (Date.now() >= user.session.expireAt.getTime()) {
        await invalidateSession(user.session.id);
        return null;
    }

    if (Date.now() >= user.session.expireAt.getTime() - SESSION_REFRESH_TIME * 1000) {
        await db.update(sessions)
        .set({ expireAt: new Date(Date.now() + SESSION_LIFETIME * 1000) })
        .where(eq(sessions.id, user.session.id));
    }

    return user;
}

// invalidate the session by deleting it from the database, which will also remove the cookie on the client side.
export const invalidateSession = async (sessionId: string) => {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// log out the user by invalidating the session and removing the cookie.


