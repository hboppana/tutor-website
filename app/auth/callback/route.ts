import { createClient } from '@/app/lib/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');

  if (code) {
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    
    if (type === 'recovery') {
      // Handle password recovery
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
    } else if (type === 'signup') {
      // Handle email confirmation
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    } else {
      // Handle OAuth sign in
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
  }

  // If no code is present, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 