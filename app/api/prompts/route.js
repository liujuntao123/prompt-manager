import { NextResponse } from 'next/server';
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  const where = {
    userId: session.user.id,
    ...(tag && { tags: { has: tag } })
  }

  try {
    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(prompts)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  
  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        ...data,
        userId: session.user.id,
      }
    })
    return NextResponse.json(newPrompt)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 