import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function POST(request, { params }) {
  const { id } = params;
  
  // 获取当前用户会话
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 检查提示词是否存在
  const prompt = await prisma.prompt.findFirst({
    where: {
      id: id,
      userId: session.user.id
    }
  });

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
  }

  // 更新 is_public 为 true
  try {
    await prisma.prompt.update({
      where: { id: id },
      data: { 
        isPublic: true,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'Prompt shared successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
