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
            <Link href={"/about/page.tsx"} className="text-gray-600">
              {post.author}
            </Link>
            <span className="text-gray-400"> - {new Date(post.createdAt).toLocaleDateString()}</span>
            <div>
            {post.category && (
            <div className="mt-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold">
                {post.category.name}
              </span>
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
