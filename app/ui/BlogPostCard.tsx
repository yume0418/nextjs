import Link from 'next/link';
import { Post } from '@/app/lib/interface/Post';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.id}`} className="block hover:no-underline">
      <article className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
          <p className="text-gray-600 mb-4">
            {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{post.author}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}