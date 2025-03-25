import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');

  try {
    const where: Prisma.PostWhereInput = {};

    if (category) {
      where.category = { id: parseInt(category) };
    }

    if (tag) {
      where.tags = { some: { tag: { name: tag } } };
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      category_name: post.category?.name,
      tags: post.tags.map(pt => pt.tag.name),
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, author, category, tags } = await request.json();

    const result = await prisma.$transaction(async (prisma) => {
      // カテゴリの挿入または取得
      const categoryResult = await prisma.category.upsert({
        where: { name: category },
        update: { name: category },
        create: { name: category },
      });

      // 投稿の挿入
      const newPost = await prisma.post.create({
        data: {
          title,
          content,
          author,
          category: { connect: { id: categoryResult.id } },
          tags: {
            create: tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          },
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return newPost;
    });

    return NextResponse.json({ success: true, post: result });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}