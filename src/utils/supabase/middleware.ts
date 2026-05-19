import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Safe checks for unconfigured or placeholder Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  const isConfigured = 
    supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('your-project') && 
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl !== ''

  if (!isConfigured) {
    // If not configured, safely bypass session refreshing without crashing the site
    return { supabaseResponse, user: null, supabase: null }
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Securely query user session inside the try-catch block
    const {
      data: { user },
    } = await supabase.auth.getUser()

    return { supabaseResponse, user, supabase }
  } catch (error) {
    console.error('⚠️ Supabase session update bypassed or failed:', error)
    return { supabaseResponse, user: null, supabase: null }
  }
}
