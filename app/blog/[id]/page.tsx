import { Post, Comment } from '@/app/lib/interface/Post';
import BlogPostDetail from '@/app/ui/BlogPostDetail';
import CommentSection from '@/app/ui/CommentSection';
import RelatedPosts from '@/app/ui/RelatedPosts';
import { notFound } from 'next/navigation';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${siteUrl}/api/detail/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error('Failed to fetch post');
  }
  const data = await res.json();
  
  // 取得したデータにタグが含まれているか確認
  console.log('Fetched Post Data:', data);

  return data;
}

async function getComments(postId: string): Promise<Comment[]> {
  const res = await fetch(`${siteUrl}/api/comments?postId=${postId}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`Failed to fetch comments for postId ${postId}`);
    throw new Error('Failed to fetch comments');
  }
  const data = await res.json();
  return data.comments;
}

async function getRelatedPosts(postId: string): Promise<Post[]> {
  try {
    const res = await fetch(`${siteUrl}/api/posts/${postId}/related`, { cache: 'no-store' });
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
  const { id } = params;

  const [post, relatedPosts, comments] = await Promise.all([
    getPost(id),
    getRelatedPosts(id),
    getComments(id)
  ]);

  if (!post) {
    return <div>投稿が見つかりません</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BlogPostDetail post={post} />
      <RelatedPosts posts={relatedPosts} />
      <CommentSection postId={post.id} initialComments={comments} />
    </div>
  );
}