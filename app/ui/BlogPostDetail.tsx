import { Post } from '@/app/lib/interface/Post';
import Link from 'next/link';

interface BlogPostDetailProps {
  post: Post;
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const createdDate = new Date(post.createdAt);
  const updatedDate = new Date(post.updatedAt);

  return (
    <article className="max-w-2xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 mb-4">
          <span>By {post.author}</span> • 
          <time dateTime={post.createdAt}>
            {createdDate.toLocaleDateString()}
          </time>
          {post.updatedAt && updatedDate > createdDate && (
            <span> • Updated: 
              <time dateTime={post.updatedAt}>
                {updatedDate.toLocaleDateString()}
              </time>
            </span>
          )}
        </div>
      </header>
      <div className="prose lg:prose-xl">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      <div className="flex justify-end ">
        <Link href="/blog/edit/page.tsx">
          <button className="bg-blue-500 text-white px-4 py-2 mb-2 rounded-lg hover:bg-blue-600">
            編集
          </button>
        </Link>
      </div>
    </article>
  );
}