import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define protected route prefixes
  const isAuthRoute = pathname.startsWith('/login')
  const isStudentRoute = pathname.startsWith('/dashboard')
  const isCommandantRoute = pathname.startsWith('/commandant')
  const isAdminRoute = pathname.startsWith('/admin')
  const isDormitoryRoute = pathname.startsWith('/dormitory')

  // Check custom session cookie first (for Quick Demo Access and local session compatibility)
  const roleCookie = request.cookies.get('oshsu_role')?.value

  // Check Supabase session in the background
  let supabaseUser = null
  let supabaseRole = null
  try {
    const { user, supabase } = await updateSession(request)
    supabaseUser = user
    if (user && supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      supabaseRole = profile?.role
    }
  } catch (err) {
    // Ignore error, fallback to cookies
  }

  // Active Role is either from Supabase or from the custom demo cookie
  const activeRole = supabaseRole || roleCookie
  const isLoggedIn = !!supabaseUser || !!roleCookie

  // If not logged in and accessing protected pages
  if (!isLoggedIn && (isStudentRoute || isCommandantRoute || isAdminRoute || isDormitoryRoute)) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If logged in, enforce role-based redirects
  if (isLoggedIn) {
    // If logged in and trying to access login page, redirect to correct dashboard
    if (isAuthRoute) {
      if (activeRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (activeRole === 'commandant') {
        return NextResponse.redirect(new URL('/commandant', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Role-specific guards
    if (isStudentRoute && activeRole !== 'student') {
      const target = activeRole === 'admin' ? '/admin' : '/commandant'
      return NextResponse.redirect(new URL(target, request.url))
    }

    if (isCommandantRoute && activeRole !== 'commandant') {
      const target = activeRole === 'admin' ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }

    if (isAdminRoute && activeRole !== 'admin') {
      const target = activeRole === 'commandant' ? '/commandant' : '/dashboard'
      return NextResponse.redirect(new URL(target, request.url))
    }
    
    // Students can only access /dormitory/[id]
    if (isDormitoryRoute && activeRole !== 'student') {
      const target = activeRole === 'admin' ? '/admin' : '/commandant'
      return NextResponse.redirect(new URL(target, request.url))
    }
  }

  return NextResponse.next()
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
