"use client"; // This needs to be a client component

import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
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
  Person as PersonIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme as useColorMode } from "./ThemeProviders";  // Import the custom hook to use color mode context

export default function Navbar() {
  const [value, setValue] = useState("/");
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toggleTheme, isDarkMode } = useColorMode(); // Get toggle function and theme status
  const [userId, setUserId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Fetch user ID when session is available
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };

    fetchUserId();
  }, [session?.user?.email]);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut({ callbackUrl: '/' });
  };

  // Paths for authenticated users (private paths)
  const privatePaths = [
    { label: "Domov", value: "/", icon: <HomeIcon /> },
    { label: "Hľadať", value: "/hladanie", icon: <SearchIcon /> },
    { label: "Pridať", value: "/pridat", icon: <AddCircleIcon /> },
    {
      label: "Profil",
      value: "#",
      icon: session?.user?.image ? (
        <Avatar 
          alt={session?.user?.name || "User"} 
          src={session?.user?.image || undefined}
          sx={{ width: 24, height: 24 }}
        />
      ) : (
        <Avatar sx={{ width: 24, height: 24 }}>{session?.user?.name?.charAt(0) || "U"}</Avatar>
      ),
    },
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
          if (newValue === "#") {
            return;
          }
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
          <BottomNavigationAction
            key={path.value}
            label={path.label}
            value={path.value}
            icon={path.icon}
            onClick={path.value === "#" ? handleProfileClick : undefined}
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
        ))}
      </BottomNavigation>

      {status === "authenticated" && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: -7,
              backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              color: isDarkMode ? "#ffffff" : "#000000",
            }
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick(`/profil/${userId}`)}>
            <ListItemIcon>
              <PersonIcon color={isDarkMode ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText>Môj profil</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("/zalozky")}>
            <ListItemIcon>
              <BookmarkIcon color={isDarkMode ? "primary" : "inherit"} />
            </ListItemIcon>
            <ListItemText>Uložené príspevky</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={toggleTheme}>
            <ListItemIcon>
              {isDarkMode ? (
                <Brightness7Icon color="primary" />
              ) : (
                <Brightness4Icon />
              )}
            </ListItemIcon>
            <ListItemText>{isDarkMode ? "Svetlý režim" : "Tmavý režim"}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: "error.main" }}>Odhlásiť sa</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
}











