import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  const skip = (page - 1) * limit;

  try {
    const whereConditions: Prisma.PostWhereInput[] = [];

    if (search) {
      whereConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (category) {
      whereConditions.push({ category: { id: parseInt(category) } });
    }

    if (tag) {
      whereConditions.push({ tags: { some: { tag: { name: tag } } } });
    }

    const where: Prisma.PostWhereInput = whereConditions.length > 0
      ? { AND: whereConditions }
      : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
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
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const formattedPosts = posts.map(post => ({
      ...post,
      category_name: post.category?.name,
      tags: post.tags.map(pt => pt.tag.name),
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      // 認証されていない場合、401エラーを返す
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const author = session?.user?.name ?? ""
    const { title, content, category, tags } = await request.json();

    const result = await prisma.$transaction(async (prisma) => {
      const whereConditions: Prisma.PostWhereInput[] = [
        { title },
        { content },
        { author },
      ];

      // カテゴリの挿入または取得
      const categoryResult = await prisma.category.upsert({
        where: { name: category },
        update: { name: category },
        create: { name: category },
      });

      whereConditions.push({ category: { id: categoryResult.id } });

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