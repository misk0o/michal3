"use client";

import { Container } from "@mui/material";
import BookmarksView from "@/sections/BookmarksView";

export default function BookmarksPage() {
  return (
    <Container maxWidth="md" sx={{ mb: 8 }}>
      <BookmarksView />
    </Container>
  );
} 