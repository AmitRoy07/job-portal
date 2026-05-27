import {headers} from 'next/headers';

// Try the most common proxy/CDN headers first because different hosts expose
// the original client IP under different names.
const IP_HEADER_PRIORITY = [
    'x-client-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-real-ip',
    'forwarded',
    'x-forwarded',
    'x-cluster-client-ip',
]

export async function getClientIp() {
    // `headers()` is async in newer Next.js versions and returns read-only
    // request headers for the current server-side request.
    const headerList = await headers();

    for (const header of IP_HEADER_PRIORITY) {
        const ip = headerList.get(header);
        if (ip) {
            // Some headers, such as x-forwarded-for, may contain a chain of IPs.
            // The first value is usually the original client.
            return ip.split(',')[0].trim();
        }
    }

    // Fallback when no trusted IP header is available.
    return "0.0.0.0";
}
