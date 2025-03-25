export interface Category {
    id: number;
    name: string;
  }
  
  export interface Tag {
    id: number;
    name: string;
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    categoryId?: number | null;
    category?: Category;
    tags?: string[];
  }
  
  export interface Comment {
    id: number;
    content: string;
    author: string;
    createdAt: string;
    postId: number;
  }