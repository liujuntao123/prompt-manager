import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function middleware(req) {
  // 从 cookie 中获取 token
  const token = req.cookies.get('authToken')?.value;
  console.log('token', token);
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Use Supabase client to query the database
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('token', token)

    if (error) {
      throw error;
    }
    
    if (data.length === 0) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/prompts/:path*'],
}; 