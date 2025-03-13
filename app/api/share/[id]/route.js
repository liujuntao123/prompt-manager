import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .eq('is_public', true) // 只返回公开的提示词
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found or not public' }, { status: 404 });
  }

  return NextResponse.json(prompt);
} 