"use client";

import {
  Button,
  Container,
  Typography,
  Box,
  useTheme,
  Link, // Import useTheme hook
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub"; // Import GitHub icon
import { useRouter } from "next/navigation";


export default function SignInView() {
  const router = useRouter();
  const theme = useTheme(); // Access the MUI theme

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",  // Horizontally center the container
        alignItems: "center",      // Vertically center the container
        minHeight: "100vh",        // Ensure full viewport height for centering
        backgroundColor: theme.palette.background.default, // Optional: use theme background
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", // Centering the content vertically
          p: 3,
          bgcolor: theme.palette.background.paper, // Use theme's paper color
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        {/* Logo / Title */}
        <Typography variant="h5" sx={{ mb: 3 }}>
          Prihlásenie
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
        Nemáte ešte účet?{" "}
        <Link
          component="button"
          onClick={() => router.push("/auth/registracia")}
          sx={{ cursor: "pointer" }}
        >
          Registrujte sa!
        </Link>
      </Typography>

        {/* Google Sign In */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => signIn("google")}
          sx={{
            mb: 1,
            borderColor: theme.palette.primary.main, // Use theme's primary color for Google button
            color: theme.palette.primary.main,
            "&:hover": {
              borderColor: theme.palette.primary.dark, // Hover effect for Google button
            },
          }}
        >
          Prihlásiť sa účtom Google
        </Button>

        {/* GitHub Sign In */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GitHubIcon />}
          onClick={() => signIn("github")}
          sx={{
            mb: 1,
            borderColor: theme.palette.mode === "light" ? "#333" : "#fff", // GitHub color for border based on mode
            color: theme.palette.mode === "light" ? "#333" : "#fff", // Text color (GitHub brand color)
            "&:hover": {
              borderColor: theme.palette.mode === "light" ? "#444" : "#bbb", // Hover effect color
            },
          }}
        >
          Prihlásiť sa účtom GitHub
        </Button>
      </Container>
    </Box>
  );
}



