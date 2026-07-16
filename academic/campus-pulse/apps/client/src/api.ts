import { Notice, Comment } from "./types";

// Dummy API

export const fetchNotices = async (): Promise<Notice[]> => {
  return DUMMY_NOTICES;
};

export const fetchComments = async (noticeId: string): Promise<Comment[]> => {
  return DUMMY_COMMENTS;
};

export const postComment = async (
  noticeId: string,
  content: string
): Promise<Comment> => {
  return { id: "1", content, createdAt: new Date().toISOString() };
};

const DUMMY_NOTICES: Notice[] = [
  {
    id: "1",
    title: "Notice 1",
    content: "Content 1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Notice 2",
    content: "Content 2",
    createdAt: new Date().toISOString(),
  },
];
const DUMMY_COMMENTS: Comment[] = [
  {
    id: "1",
    content: "Comment 1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    content: "Comment 2",
    createdAt: new Date().toISOString(),
  },

];
