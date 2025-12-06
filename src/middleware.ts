import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { APP_ROUTES } from '@/config/routes';

const PUBLIC_ROUTES = [APP_ROUTES.PUBLIC.LOGIN, APP_ROUTES.PUBLIC.REGISTER];
const AUTH_ROUTES = [APP_ROUTES.PUBLIC.LOGIN, APP_ROUTES.PUBLIC.REGISTER];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value; // Note: In a real app, you might sync zustand state to cookies or use a server-side session
    // For this implementation, we assume the token is stored in a cookie named 'auth-token' for middleware access,
    // even if Zustand handles the client-side state. 
    // Ideally, the login flow sets this cookie.

    const { pathname } = request.nextUrl;

    // Check if route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    const isAuthRoute = AUTH_ROUTES.some(route =>
        pathname.startsWith(route)
    );

    // Redirect to login if not authenticated
    // NOTE: Since we are using client-side Zustand for auth, middleware might not see the token if it's only in localStorage.
    // For a robust implementation, we should set a cookie on login.
    // For now, we will relax this check or assume the cookie is set.
    // If no cookie strategy is implemented yet, we might skip strict middleware redirection 
    // and rely on client-side protection (ProtectedRoute component) to avoid infinite loops if cookie is missing.

    // Let's assume we will implement cookie setting in the Login component.

    if (!token && !isPublicRoute) {
        const url = new URL(APP_ROUTES.PUBLIC.LOGIN, request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL(APP_ROUTES.PROTECTED.DASHBOARD, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|public).*)',
    ],
};
