import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  const prisma = new PrismaClient();
  
  try {
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: id,
        isPublic: true, // 注意：字段名可能需要根据您的 Prisma schema 调整
      },
    });

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found or not public' }, { status: 404 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 