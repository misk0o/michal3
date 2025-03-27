"use client"; // This needs to be a client component

import React, { useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Avatar,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  AddCircle as AddCircleIcon,
  Login as LoginIcon,
  AppRegistration as AppRegistrationIcon,
  Logout as LogoutIcon,
  Info as InfoIcon,
  Gavel as GavelIcon,
  Brightness7 as Brightness7Icon,
  Brightness4 as Brightness4Icon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme as useColorMode } from "./ThemeProviders";  // Import the custom hook to use color mode context

export default function Navbar() {
  const [value, setValue] = useState("/");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleTheme, isDarkMode } = useColorMode(); // Get toggle function and theme status

  // Paths for authenticated users (private paths)
  const privatePaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/hladanie", icon: <SearchIcon /> },
    { label: "Pridať", value: "/pridat", icon: <AddCircleIcon /> },
    { label: "Záložky", value: "/zalozky", icon: <BookmarkIcon /> },
    {
      label: "Profil",
      value: "/profil",
      icon: session?.user?.image ? (
        <Avatar alt={session?.user?.name || "User"} src={session?.user?.image || undefined} />
      ) : (
        <Avatar>{session?.user?.name?.charAt(0) || "U"}</Avatar>
      ),
    },
    { label: "Odhlásiť", value: "/auth/odhlasenie", icon: <LogoutIcon /> },
  ];

  // Paths for non-authenticated users (public paths)
  const publicPaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "O nás", value: "/o-nas", icon: <InfoIcon /> },
    { label: "Registrácia", value: "/auth/registracia", icon: <AppRegistrationIcon /> },
    { label: "Prihlásenie", value: "/auth/prihlasenie", icon: <LoginIcon /> },
  ];

  // Select paths based on user authentication status
  const navigationPaths = status === "authenticated" ? privatePaths : publicPaths;

  return (
    <Box
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        backgroundColor: isDarkMode ? "#121212" : "#ffffff", // Adjust the background color based on dark mode
        boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.1)",
        borderTop: "1px solid #e0e0e0",
        zIndex: 1000,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue(newValue);
            router.push(newValue);
          }
        }}
        sx={{
          backgroundColor: isDarkMode ? "#121212" : "#ffffff",
          "& .Mui-selected": {
            color: isDarkMode ? "#90caf9" : "#1976d2",
          },
          "& .MuiBottomNavigationAction-root": {
            minWidth: "50px",
            "&.Mui-selected .MuiSvgIcon-root": {
              fontSize: "28px",
            },
          },
        }}
      >
        {navigationPaths.map((path) => (
          <Tooltip key={path.value} title={path.label} arrow>
            <BottomNavigationAction
              label={path.label}
              value={path.value}
              icon={path.icon}
              sx={{
                color: isDarkMode ? "#b0b0b0" : "#5f6368",
                "& .MuiSvgIcon-root": {
                  fontSize: "24px",
                },
                "&:hover": {
                  backgroundColor: isDarkMode ? "#424242" : "#f5f5f5",
                },
              }}
            />
          </Tooltip>
        ))}
      </BottomNavigation>

      {/* Theme Toggle Button */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          color: isDarkMode ? "#ffffff" : "#000000",
        }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>
  );
}











