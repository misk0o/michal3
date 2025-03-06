// app/components/TermsView.tsx
"use client"; // Client-side only component

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function TermsView() {
  const router = useRouter();

  const handleBackToRegistration = () => {
    router.push("/auth/registracia");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Podmienky používania
      </Typography>
      <Typography variant="body1" paragraph>
        Používaním tejto stránky súhlasíte s nasledovnými podmienkami. Odporúčame vám prečítať si ich pozorne.
      </Typography>
      <Typography variant="h6">Používanie obsahu</Typography>
      <Typography variant="body1" paragraph>
        Obsah na tejto stránke je chránený autorskými právami. Bez nášho súhlasu nie je dovolené obsah kopírovať alebo šíriť.
      </Typography>
      <Typography variant="h6">Zodpovednosť</Typography>
      <Typography variant="body1" paragraph>
        Nie sme zodpovední za akékoľvek škody vzniknuté nesprávnym používaním tejto stránky.
      </Typography>
      <Button
        variant="outlined"
        onClick={handleBackToRegistration}
        sx={{ mt: 3, width: 'auto' }}  // Set width to 'auto' for smaller size
      >
        Späť na registráciu
      </Button>
    </Container>
  );
}