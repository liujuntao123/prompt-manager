import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    // 获取用户会话
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 使用 Vercel Blob 上传文件
    const { url } = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 