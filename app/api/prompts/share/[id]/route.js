import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = params;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // 检查提示词是否存在
  const { data: prompt, error: checkError } = await supabase
    .from('prompts')
    .select('id')
    .eq('id', id)
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
