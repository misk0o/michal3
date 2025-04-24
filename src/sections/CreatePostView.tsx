"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

interface UploadedImage {
  file: File;
  preview: string;
}

const CreatePostView = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    if (images.length + newImages.length > 3) {
      setError("Môžete nahrať maximálne 3 obrázky");
      return;
    }

    setImages((prev) => [...prev, ...newImages]);
    setError("");
  }, [images]);

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("Musíte byť prihlásený");
      return;
    }

    if (images.length === 0) {
      setError("Pridajte aspoň jeden obrázok");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("description", caption);
      images.forEach((image, index) => {
        formData.append(`image${index}`, image.file);
      });

      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Nepodarilo sa vytvoriť príspevok");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neočakávaná chyba");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: "470px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Typography variant="h5" gutterBottom align="center" color="primary">
        Nový príspevok
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
        Zdieľajte svoje najlepšie momenty s ostatnými
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 2,
          border: "2px dashed",
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="image-upload"
          disabled={images.length >= 3 || isSubmitting}
        />
        <label htmlFor="image-upload">
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            fullWidth
            disabled={images.length >= 3 || isSubmitting}
          >
            Vybrať fotky
          </Button>
        </label>
        <Typography variant="caption" display="block" align="center" sx={{ mt: 1 }}>
          Môžete pridať až 3 fotiek
        </Typography>

        {images.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                }}
              >
                <Image
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                  onClick={() => handleRemoveImage(index)}
                  disabled={isSubmitting}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Popis príspevku"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={isSubmitting}
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        sx={{
          height: 48,
          background: "linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)",
          "&:hover": {
            background: "linear-gradient(90deg, #FF5B5B 0%, #3EBDB4 100%)",
          },
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Zdieľať príspevok"
        )}
      </Button>
    </Box>
  );
};

export default CreatePostView; 