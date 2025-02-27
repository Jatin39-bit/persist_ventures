export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
export async function middleware(request) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/signup';

    if (isPublicPath) {
        return NextResponse.next();
    }
    const token = (await cookies()).get("token")?.value || request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.rewrite(new URL('/login',request.url));
    }

    try{
        const secret= new TextEncoder().encode(process.env.SECRET);
        const decoded = await jwtVerify(token, secret);
        if (!decoded) {
            return NextResponse.rewrite(new URL('/login',request.url));
        }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", decoded.id);
        requestHeaders.set("x-user-email", decoded.email);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }catch(error){
        console.log(error.message);
        return NextResponse.rewrite(new URL('/login',request.url));
    }

}

export const config = {
    matcher: [
        '/profile',
        '/leaderboard',
        '/upload',
    ]
}


