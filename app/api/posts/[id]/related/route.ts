import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } } // 正しい型を使用
) {
  const postId = parseInt(params.id);

  try {
    // 現在の投稿を取得
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { category: true, tags: true },
    });

    if (!currentPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // 関連記事を取得
    const relatedPosts = await prisma.post.findMany({
      where: {
        OR: [
          { categoryId: currentPost.categoryId },
          {
            tags: {
              some: {
                id: { in: currentPost.tags.map((tag) => tag.id) },
              },
            },
          },
        ],
        NOT: { id: postId }, // 現在の投稿を除外
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3, // 最大3件取得
    });

    return NextResponse.json({ relatedPosts });
  } catch (error) {
    console.error('Failed to fetch related posts:', error);
    return NextResponse.json({ error: 'Failed to fetch related posts' }, { status: 500 });
  }
}
