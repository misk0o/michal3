"use client";
import React, { useState } from "react";
import { 
  Box, 
  TextField, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar,
  Typography,
  Divider
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

const SearchView = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term: string) => {
    if (term.length < 2) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profil/${userId}`);
  };

  return (
    <Box sx={{ 
      maxWidth: '470px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      {isLoading ? (
        <Typography align="center">Loading...</Typography>
      ) : (
        <List>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <ListItem 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
                onClick={() => handleProfileClick(user.id)}
              >
                <ListItemAvatar>
                  <Avatar src={user.image || ''} alt={user.name || 'user'} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                  }
                  secondary={user.email}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {searchTerm.length >= 2 && users.length === 0 && (
            <Typography align="center" color="textSecondary">
              No users found
            </Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default SearchView; 