import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  // 从 URL 中获取 tag 参数
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  let query = supabase
    .from('prompts')
    .select('*');

  // 如果存在 tag 参数，添加过滤条件
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data: prompts, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(prompts);
}

export async function POST(request) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  // 从cookie中获取authToken
  const cookieStore = request.cookies;
  const authToken = cookieStore.get('authToken')?.value;
  
  if (!authToken) {
    return NextResponse.json({ error: 'No authentication token' }, { status: 401 });
  }

  const data = await request.json();
  // 使用authToken作为user_id
  data.user_id = authToken;

  const { data: newPrompt, error } = await supabase
    .from('prompts')
    .insert([data])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newPrompt[0]);
} 