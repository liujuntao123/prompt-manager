import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma'; // 确保你有这个prisma客户端实例文件

export async function GET() {
  try {
    

    // 使用Prisma查询所有tags
    const tags = await prisma.tag.findMany({
      select: {
        name: true
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    
    const { name } = await request.json();
    console.log('name',name);
    
    // 使用Prisma创建新tag
    const tag = await prisma.tag.create({
      data: {
        name:name,
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
} 