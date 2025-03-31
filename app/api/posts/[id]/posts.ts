import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { category: true, tags: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'An error occurred while fetching the post' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    const { title, content, category, tags } = await request.json();

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        category: {
          connectOrCreate: {
            where: { name: category },
            create: { name: category },
          },
        },
        tags: {
          set: tags.map((tag: string) => ({ name: tag })),
        },
      },
      include: { category: true, tags: true },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'An error occurred while updating the post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the post' }, { status: 500 });
  }
}