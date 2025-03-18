import { Post } from '@/app/lib/interface/Post';
import BlogPostCard from '@/app/ui/BlogPostCard';
import Link from 'next/link';

async function getPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await res.json();
  return data.posts;
}

export default async function BlogList() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">ブログ投稿一覧</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}