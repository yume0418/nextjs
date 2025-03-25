'use client';

import { useState } from 'react';
import { Comment } from '@/app/lib/interface/Post';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const handleCommentAdded = (newComment: Comment) => {
    setComments(prevComments => [newComment, ...prevComments]);
  };

  return (
    <>
      <CommentList comments={comments} />
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
    </>
  );
}