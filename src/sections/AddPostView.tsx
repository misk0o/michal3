"use client";
import React, { useState, useRef } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography,
  IconButton,
  Grid
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { createPost } from "@/app/actions/posts";
import { useRouter } from "next/navigation";

const AddPostView = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 3) {
        alert("You can only upload up to 3 images");
        return;
      }
      setImages([...images, ...newImages]);
      
      // Create previews
      newImages.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim() && images.length === 0) {
      alert("Please add a description or at least one image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      await createPost(formData);
      router.push("/prispevok");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post. Please try again.");
    }
  };

  return (
    <Box sx={{ 
      maxWidth: '470px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create New Post
      </Typography>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {previews.map((preview, index) => (
          <Grid item xs={4} key={index}>
            <Box sx={{ position: 'relative' }}>
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <IconButton
                onClick={() => removeImage(index)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
        {previews.length < 3 && (
          <Grid item xs={4}>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: '100%',
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: '8px'
              }}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#666', mb: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Add Photo
              </Typography>
            </Button>
          </Grid>
        )}
      </Grid>

      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Write a caption..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={!description.trim() && images.length === 0}
      >
        Share Post
      </Button>
    </Box>
  );
};

export default AddPostView; 