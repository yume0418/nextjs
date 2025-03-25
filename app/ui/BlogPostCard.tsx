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
          {post.category && (
            <div className="mt-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {post.category.name}
              </span>
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}