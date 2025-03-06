// src/sections/NonAuthHomeView.tsx
"use client";
import React from "react";
import { Typography, Container, Link } from "@mui/material";

// This component renders the home page for non-authenticated users
const NonAuthHomeView: React.FC = () => {
  return (
    <Container>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Domovská stránka
      </Typography>
      <Typography>
        Registrujte sa, aby ste mohli pridať príspevky a zobraziť profil.
      </Typography>
    </Container>
  );
};

export default NonAuthHomeView;