// src/sections/PostView.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Post, User } from "@prisma/client";
import { 
  Card, 
  CardHeader, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Avatar, 
  IconButton, 
  Typography,
  Box 
} from "@mui/material";
import { 
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  BookmarkBorder as SaveIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { fetchPosts } from "@/app/actions/posts";

interface PostViewProps {
  post?: Post & { user: User };
}

const PostView = () => {
  const [posts, setPosts] = useState<(Post & { user: User })[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    loadPosts();
  }, []);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 2,
      maxWidth: '470px', // Instagram-like width
      margin: '0 auto' 
    }}>
      {posts.map((post) => (
        <Card key={post.id} sx={{ 
          width: '100%',
          boxShadow: 'none',
          border: '1px solid #dbdbdb',
          borderRadius: '8px',
          mb: 2
        }}>
          {/* User Header */}
          <CardHeader
            avatar={
              <Avatar 
                src={post.user.image || ''} 
                alt={post.user.name || 'user'}
              />
            }
            title={post.user.name}
            sx={{ 
              '.MuiCardHeader-title': { 
                fontWeight: 600,
                fontSize: '14px'
              }
            }}
          />

          {/* Post Image */}
          <CardMedia
            component="img"
            image={post.imageUrl}
            alt="Post image"
            sx={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '470px',
              objectFit: 'cover'
            }}
          />

          {/* Action Buttons */}
          <CardActions disableSpacing sx={{ padding: '8px 16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={() => handleLike(post.id)}
                  sx={{ padding: '8px' }}
                >
                  {likedPosts.has(post.id) ? (
                    <FavoriteIcon sx={{ color: 'red' }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton sx={{ padding: '8px' }}>
                  <CommentIcon />
                </IconButton>
                <IconButton sx={{ padding: '8px' }}>
                  <SendIcon />
                </IconButton>
              </Box>
              <IconButton sx={{ padding: '8px' }}>
                <SaveIcon />
              </IconButton>
            </Box>
          </CardActions>

          {/* Caption */}
          {post.caption && (
            <CardContent sx={{ padding: '0 16px 16px 16px' }}>
              <Typography variant="body2" color="text.primary">
                <Box component="span" sx={{ fontWeight: 600, marginRight: 1 }}>
                  {post.user.name}
                </Box>
                {post.caption}
              </Typography>
            </CardContent>
          )}
        </Card>
      ))}
    </Box>
  );
};

export default PostView;
