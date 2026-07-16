import React from 'react';
import CommentSection from './comment';
import { Notice } from '../types';

interface NoticeItemProps {
  notice: Notice;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ notice }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-6 p-4">
      <h2 className="text-xl font-semibold mb-2">{notice.title}</h2>
      <p className="text-gray-700 mb-4">{notice.content}</p>
      <div className="text-sm text-gray-500 mb-4">
        Posted on: {new Date(notice.createdAt).toLocaleDateString()}
      </div>
      <CommentSection noticeId={notice.id} />
    </div>
  );
};

export default NoticeItem;

