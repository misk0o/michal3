"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useSession } from "next-auth/react";
import { fetchBookmarksForUser } from "@/app/actions/interactions";
import { useRouter } from "next/navigation";

interface BookmarkedPost {
  id: string;
  post: {
    id: string;
    caption: string | null;
    images: { imageUrl: string }[];
    user: {
      name: string | null;
    };
  };
}

export default function BookmarksPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);

  useEffect(() => {
    const loadBookmarks = async () => {
      if (!session?.user?.email) return;
      const userBookmarks = await fetchBookmarksForUser(session.user.email);
      setBookmarks(userBookmarks);
    };
    loadBookmarks();
  }, [session]);

  const handlePostClick = (postId: string) => {
    router.push(`/prispevok/${postId}`);
  };

  return (
    <Box sx={{ maxWidth: '935px', margin: '0 auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Uložené príspevky
      </Typography>

      {bookmarks.length === 0 ? (
        <Typography color="textSecondary" align="center">
          Zatiaľ nemáte žiadne uložené príspevky
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {bookmarks.map((bookmark) => (
            <Grid item xs={12} sm={6} md={4} key={bookmark.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
                onClick={() => handlePostClick(bookmark.post.id)}
              >
                <CardMedia
                  component="img"
                  image={bookmark.post.images[0]?.imageUrl || ''}
                  alt="Saved post"
                  sx={{ aspectRatio: '1', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {bookmark.post.caption || 'No caption'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Posted by {bookmark.post.user.name || 'Unknown user'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 