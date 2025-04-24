"use client";
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";

interface ProfileViewProps {
  profile: {
    id: string;
    userId?: string;
    bio: string | null;
    avatarUrl: string | null;
    location: string | null;
    interests: string[];
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  posts: {
    id: string;
    caption: string | null;
    images: { imageUrl: string }[];
    _count: {
      likes: number;
      comments: number;
    };
  }[];
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isOwnProfile: boolean;
}

const ProfileView = ({ profile, user, posts, stats, isOwnProfile }: ProfileViewProps) => {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push(`/profil/${user.id}/upravit`);
  };

  const handlePostClick = (postId: string) => {
    router.push(`/prispevok/${postId}`);
  };

  return (
    <Box sx={{ maxWidth: "935px", margin: "0 auto", p: 2 }}>
      {/* Profile Info Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Avatar */}
          <Grid item>
            <Avatar
              src={profile.avatarUrl || user.image || ""}
              alt={user.name || "Profile"}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>

          {/* Profile Info */}
          <Grid item xs>
            <Box sx={{ ml: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h1" sx={{ mr: 2 }}>
                  {user.name}
                </Typography>
                {isOwnProfile && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditProfile}
                    sx={{
                      background: "linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #FF5B5B 0%, #3EBDB4 100%)",
                      },
                    }}
                  >
                    Upraviť profil
                  </Button>
                )}
              </Box>

              {/* Stats */}
              <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                <Typography>
                  <strong>{stats.postsCount}</strong> príspevkov
                </Typography>
                <Typography>
                  <strong>{stats.followersCount}</strong> sledovateľov
                </Typography>
                <Typography>
                  <strong>{stats.followingCount}</strong> sledovaných
                </Typography>
              </Stack>

              {/* Bio */}
              {profile.bio && (
                <Typography sx={{ mb: 1 }}>{profile.bio}</Typography>
              )}

              {/* Location */}
              {profile.location && (
                <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                  <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{profile.location}</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Posts Grid */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Príspevky
        </Typography>
        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <Image
                  src={post.images[0]?.imageUrl || ""}
                  alt={post.caption || "Post"}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    p: 1,
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography variant="body2">❤️ {post._count.likes}</Typography>
                  <Typography variant="body2">💬 {post._count.comments}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfileView; 