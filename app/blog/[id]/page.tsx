import { Post } from '@/app/lib/interface/Post';
import BlogPostDetail from '@/app/ui/BlogPostDetail';

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch post');
  }
  const data = await res.json();
  return data.post;
}

export default async function BlogPost({ params }: { params: { id: string } }) {
    const id = params.id; // paramsをawaitせずに直接使用
  
    if (!id) {
      return <div>投稿が見つかりません</div>; // idが存在しない場合の処理
    }
  
    const post = await getPost(id); // 修正後
  
    if (!post) {
      return <div>投稿が見つかりません</div>;
    }
  
    return <BlogPostDetail post={post} />;
  }
  