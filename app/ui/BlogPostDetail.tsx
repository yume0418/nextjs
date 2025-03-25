import { Post } from '@/app/lib/interface/Post';

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

      {post.category && (
        <div className="mb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            Category: {post.category.name}
          </span>
        </div>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <div className="mb-4">
          {post.tags.map((tag: string) => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose lg:prose-xl">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}