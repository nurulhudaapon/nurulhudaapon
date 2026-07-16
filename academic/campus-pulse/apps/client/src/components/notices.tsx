import React, { useState, useEffect } from 'react';
import NoticeItem from './notice-time';
import { Notice } from '../types';
import { fetchNotices } from '../api';

const Notices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const loadNotices = async () => {
      const fetchedNotices = await fetchNotices();
      setNotices(fetchedNotices);
    };
    loadNotices();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Campus Notices</h1>
      {notices.map((notice) => (
        <NoticeItem key={notice.id} notice={notice} />
      ))}
    </div>
  );
};

export default Notices;

