'use client';

import { Category, Tag } from '@/app/lib/interface/Post';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PostFilterProps {
  categories: Category[];
  tags: Tag[];
}

export default function PostFilter({ categories, tags }: PostFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [tag, setTag] = useState(searchParams?.get('tag') || '');

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    router.push(`/blog?${params.toString()}`);
  }, [category, tag, router, searchParams]);

  useEffect(() => {
    updateFilters();
  }, [category, tag, updateFilters]);

  return (
    <div className="flex mb-6">
      <div className="mr-4">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Category
        </label>
        <select
          id="category-filter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={(e) => setCategory(e.target.value)}
          value={category}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Tag
        </label>
        <select
          id="tag-filter"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          onChange={(e) => setTag(e.target.value)}
          value={tag}
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}