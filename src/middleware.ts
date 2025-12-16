import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')

    // 1. Si intenta entrar a dashboard/protegido SIN token -> Login
    if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Comentado: Permitir acceso al login aunque tenga token, para que el usuario pueda cambiar de cuenta si lo desea explicitamente.
    /*
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    */

    return NextResponse.next()
}

// Configurar qué rutas protege el middleware
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/register',
        '/invoices/:path*',
        '/accounting/:path*'
    ],
}
