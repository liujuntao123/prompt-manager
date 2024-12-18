import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json(prompt);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, description, is_public, tags, image_url, version } = await request.json();

    const prompt = await prisma.prompt.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    const updateData = {
      updatedAt: new Date(),
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(description !== undefined && { description }),
      ...(is_public !== undefined && { isPublic: is_public }),
      ...(tags !== undefined && { tags }),
      ...(image_url !== undefined && { imageUrl: image_url }),
      ...(version !== undefined && { version })
    };

    await prisma.prompt.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ message: 'Prompt updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const prompt = await prisma.prompt.findUnique({
      where: {
        id: id,
        userId: session.user.id
      }
    });

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    await prisma.prompt.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 