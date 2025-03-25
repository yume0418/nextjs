import { Post, Category, Tag } from '@/app/lib/interface/Post';
import BlogPostCard from '@/app/ui/BlogPostCard';
import PostFilter from '@/app/ui/PostFilter';

async function getPosts(searchParams: { category?: string, tag?: string }): Promise<Post[]> {
  const params = new URLSearchParams(searchParams as any); 
  const res = await fetch(`http://localhost:3000/api/posts?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await res.json();
  return data.posts;
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch('http://localhost:3000/api/categories', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }
  return res.json();
}

async function getTags(): Promise<Tag[]> {
  const res = await fetch('http://localhost:3000/api/tags', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch tags');
  }
  return res.json();
}

export default async function BlogList({ searchParams }: { searchParams: { category?: string, tag?: string } }) {
  const params = await searchParams; // 追加
  const [posts, categories, tags] = await Promise.all([
    getPosts(params), // 修正
    getCategories(),
    getTags()
  ]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">ブログ投稿一覧</h1>
      <PostFilter categories={categories} tags={tags} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}