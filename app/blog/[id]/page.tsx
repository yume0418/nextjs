import { Post, Comment } from '@/app/lib/interface/Post';
import BlogPostDetail from '@/app/ui/BlogPostDetail';
import CommentSection from '@/app/ui/CommentSection';
import RelatedPosts from '@/app/ui/RelatedPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link'

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${siteUrl}/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch post');
  }
  const data = await res.json();
  return data.post;
}

async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`http://localhost:3000/api/comments?postId=${postId}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`Failed to fetch comments for postId ${postId}`);
    throw new Error('Failed to fetch comments');
  }
  const data = await res.json();
  return data.comments;
}

async function getRelatedPosts(postId: string): Promise<Post[]> {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${postId}/related`, { cache: 'no-store' });
    if (!res.ok) {
      if (res.status === 404) {
        console.log(`No related posts found for postId ${postId}`);
        return [];
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.relatedPosts || [];
  } catch (error) {
    console.error(`Failed to fetch related posts for postId ${postId}:`, error);
    return [];
  }
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const [post, relatedPosts, comments] = await Promise.all([
    getPost(params.id),
    getRelatedPosts(params.id),
    getComments(params.id)
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BlogPostDetail post={post} />
      <RelatedPosts posts={relatedPosts} />
      <CommentSection postId={post.id} initialComments={comments} />
      <Link
        href={`/blog/edit/${post.id}`} 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white !bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >編集
      </Link>
    </div>
  );
}