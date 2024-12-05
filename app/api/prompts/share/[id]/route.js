import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'

export async function POST(request, { params }) {
  const { id } = params;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { userId } = await auth()
  // 检查提示词是否存在
  const { data: prompt, error: checkError } = await supabase
    .from('prompts')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (checkError || !prompt) {
    return NextResponse.json(
      { error: checkError ? checkError.message : 'Prompt not found' }, 
      { status: 404 }
    );
  }

  // 更新 is_public 为 true
  const { error: updateError } = await supabase
    .from('prompts')
    .update({ 
      is_public: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Prompt shared successfully' });
}
