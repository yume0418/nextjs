import Link from 'next/link';
import { Post } from '@/app/lib/interface/Post';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">関連記事</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="block">
            <div className="border border-white rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
              <h3 className="font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.content.substring(0, 100)}...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}