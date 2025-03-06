//src/app/hladanie/page.tsx

"use client";

import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { 
  Container, 
  TextField, 
  Box, 
  ImageList, 
  ImageListItem, 
  Typography,
  InputAdornment,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { searchUsers } from "@/app/actions/users";
import debounce from 'lodash.debounce';

export default function Hladanie() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Debounced search function
  const debouncedSearch = debounce(async (term: string) => {
    const results = await searchUsers(term);
    setUsers(results);
  }, 300);

  // Initial load of all users
  useEffect(() => {
    const loadAllUsers = async () => {
      const results = await searchUsers("");
      setUsers(results);
    };
    loadAllUsers();
  }, []);

  // Search effect
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  return (
    <Container maxWidth="md">
      {/* Search Input */}
      <Box sx={{ my: 3 }}>
        <TextField
          fullWidth
          placeholder="Vyhľadať používateľov..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: theme.palette.background.paper,
            }
          }}
        />
      </Box>

      {/* Users Grid */}
      <ImageList 
        cols={isMobile ? 2 : 3} 
        gap={8}
        sx={{ 
          mb: 8,
          '& .MuiImageListItem-root': {
            overflow: 'hidden',
            borderRadius: '4px',
          }
        }}
      >
        {users.map((user) => (
          <ImageListItem 
            key={user.id}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
              position: 'relative',
              aspectRatio: '1',
            }}
          >
            <img
              src={user.image || '/default-avatar.png'}
              alt={user.name || 'User'}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Username overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '8px',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {user.name}
              </Typography>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  );
}