import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)

  const { pathname } = request.nextUrl

  // Define protected route prefixes
  const isAuthRoute = pathname.startsWith('/login')
  const isStudentRoute = pathname.startsWith('/dashboard')
  const isCommandantRoute = pathname.startsWith('/commandant')
  const isAdminRoute = pathname.startsWith('/admin')

  // If not logged in and accessing protected pages
  if (!user && (isStudentRoute || isCommandantRoute || isAdminRoute)) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in, enforce role-based redirects
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // If logged in and trying to access login page, redirect to correct dashboard
    if (isAuthRoute) {
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (role === 'commandant') {
        return NextResponse.redirect(new URL('/commandant', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Role-specific guards
    if (isStudentRoute && role !== 'student') {
      const target = role === 'admin' ? '/admin' : '/commandant'
      return NextResponse.redirect(new URL(target, request.url))
    }

    if (isCommandantRoute && role !== 'commandant') {
      const target = role === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }

    if (isAdminRoute && role !== 'admin') {
      const target = role === 'commandant' ? '/commandant' : '/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Next.js public folder icons/files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
