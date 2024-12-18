import { NextResponse } from 'next/server';
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const start = performance.now()
  
  const session = await auth()
  console.log(`[GET /api/prompts] Auth took ${performance.now() - start}ms`)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  const where = {
    userId: session.user.id,
    ...(tag && { tags: { has: tag } })
  }

  const queryStart = performance.now()

  try {
    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    console.log(`[GET /api/prompts] Database query took ${performance.now() - queryStart}ms`)
    console.log(`[GET /api/prompts] Total time: ${performance.now() - start}ms`)
    return NextResponse.json(prompts)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  const start = performance.now()
  
  const session = await auth()
  console.log(`[POST /api/prompts] Auth took ${performance.now() - start}ms`)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  const dbStart = performance.now()
  
  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        ...data,
        userId: session.user.id,
      }
    })
    console.log(`[POST /api/prompts] Database operation took ${performance.now() - dbStart}ms`)
    console.log(`[POST /api/prompts] Total time: ${performance.now() - start}ms`)
    return NextResponse.json(newPrompt)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 