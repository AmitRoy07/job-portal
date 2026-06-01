import { cookies } from "next/headers";
import { cache } from "react";
import { validateSessionAndGetUser } from "./use-cases/sessions";

export const getCurrentUser = cache(async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        return null;
    }

    // TODO: use the session token to fetch the user
    const user = await validateSessionAndGetUser(session);

    return user;

});