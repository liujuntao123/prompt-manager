import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server'

export async function GET(request) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { userId } = await auth()
  
  // 从 URL 中获取 tag 参数
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  let query = supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId);
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
  const { userId } = await auth()

  const data = await request.json();
  // 使用authToken作为user_id
  data.user_id = userId;

  const { data: newPrompt, error } = await supabase
    .from('prompts')
    .insert([data])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(newPrompt[0]);
} 