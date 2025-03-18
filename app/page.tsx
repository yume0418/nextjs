import Link from 'next/link';
import { Post } from '@/app/lib/interface/Post';

async function getPosts(): Promise<Post[]> {
  const res = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await res.json();
  return data.posts;
}

export default async function HOME() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">ブログ投稿一覧</h1>
      <ul className="space-y-4">
        {posts.map((post: Post) => (
          <li key={post.id} className="border p-2 rounded-lg">
            <Link href={`/blog/${post.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {post.title}
            </Link><br />
            <Link href={"/about"} className="text-gray-600">
              {post.author}
            </Link>
            <span className="text-gray-400"> - {new Date(post.createdAt).toLocaleDateString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
