import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 生成唯一文件名
    const fileName = `${Date.now()}-${file.name}`;
    
    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('prompt-manager') // 替换为你的 bucket 名称
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // 获取文件的公共URL
    const { data: { publicUrl } } = supabase.storage
      .from('prompt-manager')
      .getPublicUrl(fileName);
    
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 