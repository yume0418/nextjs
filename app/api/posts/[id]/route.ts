import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GETメソッド
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id, 10) }, // idを整数に変換
      });
  
      if (!post) {
        return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ post }), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'Error fetching post' }), { status: 500 });
    }
  }
  

// PUTメソッド
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // params.idがundefinedの場合の処理
  if (!params.id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json(); // リクエストボディを取得

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(params.id, 10) },
      data: {
        title: body.title, // 必要なフィールドを指定
        content: body.content,
        author: body.author, // 必要に応じて追加
      },
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
