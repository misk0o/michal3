"use client";

import { useEffect, useState } from "react";
import type { Post, User } from "@prisma/client";
import { fetchBookmarkedPosts } from "@/app/actions/interactions";
import PostView from "./PostView";
import { Box, Typography } from "@mui/material";

interface ExtendedPost extends Post {
  user: User;
  comments: any[];
  likes: any[];
  bookmarks: any[];
}

const BookmarksView = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<ExtendedPost[]>([]);

  useEffect(() => {
    const loadBookmarkedPosts = async () => {
      const posts = await fetchBookmarkedPosts() as ExtendedPost[];
      setBookmarkedPosts(posts);
    };

    loadBookmarkedPosts();
  }, []);

  if (bookmarkedPosts.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">
          Zatiaľ nemáte žiadne uložené príspevky
        </Typography>
      </Box>
    );
  }

  return <PostView posts={bookmarkedPosts} />;
};

export default BookmarksView; 
