"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Box, Button, TextField, Typography, Avatar } from "@mui/material";
import { User } from "@prisma/client";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    profile?: {
      bio: string | null;
    };
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await updateProfile({
        userId: user.id,
        name,
        bio,
        image,
      });
      router.push(`/profil/${user.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Niečo sa pokazilo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 600,
        mx: "auto",
        p: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Upraviť profil
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={previewUrl || undefined}
          sx={{ width: 100, height: 100 }}
        />
        <Button variant="outlined" component="label">
          Zmeniť fotku
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <TextField
        label="Meno"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />

      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        multiline
        rows={4}
      />

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? "Ukladá sa..." : "Uložiť zmeny"}
      </Button>
    </Box>
  );
} 