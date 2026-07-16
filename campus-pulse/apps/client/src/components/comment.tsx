import React, { useState, useEffect } from 'react';
import { TypingIndicator } from './typing';
import { Comment } from '../types';
import { fetchComments, postComment } from '../api';

interface CommentSectionProps {
  noticeId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ noticeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(noticeId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [noticeId]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000); // Simulate typing indicator
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const postedComment = await postComment(noticeId, newComment);
      setComments([...comments, postedComment]);
      setNewComment('');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 rounded p-2 mb-2">
          <p>{comment.content}</p>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
      <form onSubmit={handleSubmitComment} className="mt-4">
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          className="w-full p-2 border rounded"
          placeholder="Write a comment..."
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Comment
        </button>
      </form>
      <TypingIndicator isTyping={isTyping} />
    </div>
  );
};

export default CommentSection;

