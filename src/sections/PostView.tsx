// src/sections/PostView.tsx
"use client";
import React, { useEffect, useState } from "react";
import type { Post, User } from "@prisma/client";
import { 
  Card, 
  CardHeader, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Avatar, 
  IconButton, 
  Typography,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  keyframes
} from "@mui/material";
import { 
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { fetchPosts } from "@/app/actions/posts";
import { toggleLike, addComment, deleteComment, toggleBookmark } from "@/app/actions/interactions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ExtendedPost extends Post {
  user: User;
  images: {
    id: string;
    imageUrl: string;
    order: number;
  }[];
  comments: {
    id: string;
    content: string;
    userId: string;
    user: User;
  }[];
  likes: {
    id: string;
    userId: string;
    user: User;
  }[];
  bookmarks: {
    id: string;
    userId: string;
    user: User;
  }[];
}

interface PostViewProps {
  posts?: ExtendedPost[];
}

const likeAnimation = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const bookmarkAnimation = keyframes`
  0% { transform: scale(1) translateY(0); }
  25% { transform: scale(1.2) translateY(-2px); }
  50% { transform: scale(0.95) translateY(1px); }
  100% { transform: scale(1) translateY(0); }
`;

const PostView = ({ posts: propPosts }: PostViewProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState<ExtendedPost[]>(propPosts || []);
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [animatingLike, setAnimatingLike] = useState<string | null>(null);
  const [animatingBookmark, setAnimatingBookmark] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!propPosts) {
    const loadPosts = async () => {
      try {
          const fetchedPosts = await fetchPosts() as ExtendedPost[];
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    loadPosts();
    }
  }, [propPosts]);

  const handleLike = async (postId: string) => {
    if (!session) return;
    setAnimatingLike(postId);
    await toggleLike(postId);
    const fetchedPosts = await fetchPosts() as ExtendedPost[];
    setPosts(fetchedPosts);
    setTimeout(() => setAnimatingLike(null), 500);
  };

  const handleBookmark = async (postId: string) => {
    if (!session) return;
    setAnimatingBookmark(postId);
    await toggleBookmark(postId);
    const fetchedPosts = await fetchPosts() as ExtendedPost[];
    setPosts(fetchedPosts);
    setTimeout(() => setAnimatingBookmark(null), 500);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !session || !selectedPost) return;
    await addComment(selectedPost, commentText.trim());
    setCommentText("");
    setCommentDialogOpen(false);
    const fetchedPosts = await fetchPosts() as ExtendedPost[];
    setPosts(fetchedPosts);
  };

  const handleDeleteComment = async () => {
    if (!selectedComment || !session) return;
    await deleteComment(selectedComment);
    setDeleteDialogOpen(false);
    setSelectedComment(null);
    const fetchedPosts = await fetchPosts() as ExtendedPost[];
    setPosts(fetchedPosts);
  };

  const openCommentDialog = (postId: string) => {
    setSelectedPost(postId);
    setCommentDialogOpen(true);
  };

  const handleInlineCommentSubmit = async (postId: string) => {
    if (!commentInputs[postId]?.trim() || !session) return;
    await addComment(postId, commentInputs[postId].trim());
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    const fetchedPosts = await fetchPosts() as ExtendedPost[];
    setPosts(fetchedPosts);
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profil/${userId}`);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 2,
      maxWidth: '470px',
      margin: '0 auto' 
    }}>
      {posts.map((post) => {
        const userEmail = session?.user?.email;
        const isLiked = post.likes.some(like => like.user.email === userEmail);
        const isBookmarked = post.bookmarks.some(bookmark => bookmark.user.email === userEmail);

        return (
        <Card key={post.id} sx={{ 
          width: '100%',
          boxShadow: 'none',
          border: '1px solid #dbdbdb',
          borderRadius: '8px',
          mb: 2
        }}>
          <CardHeader
            avatar={
              <Avatar 
                src={post.user.image || ''} 
                alt={post.user.name || 'user'}
                onClick={() => handleProfileClick(post.user.id)}
                sx={{ cursor: 'pointer' }}
              />
            }
            title={
              <Typography
                onClick={() => handleProfileClick(post.user.id)}
                sx={{ 
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                {post.user.name}
              </Typography>
            }
            sx={{ 
              '.MuiCardHeader-title': { 
                fontWeight: 600,
                fontSize: '14px'
              }
            }}
          />

          <CardMedia
            component="img"
              image={post.images[0]?.imageUrl || ''}
            alt="Post image"
            sx={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '470px',
              objectFit: 'cover'
            }}
          />

          <CardActions disableSpacing sx={{ padding: '8px 16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  onClick={() => handleLike(post.id)}
                  sx={{ padding: '8px' }}
                >
                    {isLiked ? (
                      <FavoriteIcon 
                        sx={{ 
                          color: '#ff1744',
                          animation: animatingLike === post.id ? `${likeAnimation} 0.5s ease-in-out` : 'none',
                        }} 
                      />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                  <IconButton 
                    onClick={() => openCommentDialog(post.id)}
                    sx={{ padding: '8px' }}
                  >
                  <CommentIcon />
                </IconButton>
              </Box>
                <IconButton 
                  onClick={() => handleBookmark(post.id)}
                  sx={{ padding: '8px' }}
                >
                  {isBookmarked ? (
                    <BookmarkIcon 
                      sx={{ 
                        color: '#1976d2',
                        transform: animatingBookmark === post.id ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.3s ease-in-out',
                      }} 
                    />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
              </IconButton>
            </Box>
          </CardActions>

            <CardContent sx={{ pt: 0, pb: 1 }}>
              {post.likes.length > 0 && (
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                </Typography>
              )}
              
          {post.caption && (
                <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                <Box component="span" sx={{ fontWeight: 600, marginRight: 1 }}>
                  {post.user.name}
                </Box>
                {post.caption}
              </Typography>
              )}
            </CardContent>

            <CardContent sx={{ pt: 0, pb: 1 }}>
              {post.comments.length > 0 && (
                <>
                  {post.comments.slice(0, showAllComments[post.id] ? undefined : 2).map((comment) => (
                    <Box key={comment.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar src={comment.user.image || ''} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        <strong>{comment.user.name}: </strong>
                        {comment.content}
                      </Typography>
                      {comment.user.email === session?.user?.email && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedComment(comment.id);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.light',
                            },
                            padding: '4px',
                            marginLeft: '8px',
                            opacity: 1,
                            visibility: 'visible'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  {post.comments.length > 2 && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', mt: 1 }}
                      onClick={() => setShowAllComments(prev => ({
                        ...prev,
                        [post.id]: !prev[post.id]
                      }))}
                    >
                      {showAllComments[post.id] ? 'Show less' : `View all ${post.comments.length} comments`}
                    </Typography>
                  )}
                </>
              )}
            </CardContent>

            {/* Inline Comment Input */}
            <CardContent sx={{ pt: 0, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleInlineCommentSubmit(post.id);
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                    }
                  }}
                />
                <IconButton 
                  size="small" 
                  onClick={() => handleInlineCommentSubmit(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </CardContent>
        </Card>
        );
      })}

      {/* Comment Dialog */}
      <Dialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={3}
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
            variant="contained"
          >
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Comment Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '16px'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.2rem',
          fontWeight: 600,
          pb: 1
        }}>
          Delete Comment
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this comment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          pt: 2,
          gap: 1
        }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              borderRadius: '20px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteComment} 
            color="error"
            variant="contained"
            sx={{ 
              textTransform: 'none',
              borderRadius: '20px'
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostView;
