// app/components/GdprView.tsx
"use client"; // Client-side only component

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function GdprView() {
  const router = useRouter();

  const handleBackToRegistration = () => {
    router.push("/auth/registracia");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
  Ochrana osobných údajov (GDPR)
</Typography>
<Typography variant="body1" paragraph>
  Vaše súkromie je pre nás dôležité. Zhromažďujeme údaje, ako meno, e-mail, IP adresu a cookies, na zlepšenie služieb a splnenie zákonných povinností. Vaše údaje chránime šifrovaním a kontrolou prístupu. Máte právo na prístup, opravu, vymazanie a obmedzenie spracovania svojich údajov. Ak máte otázky alebo chcete uplatniť svoje práva, kontaktujte nás na: 
</Typography>
<Typography variant="body1" paragraph>
  <strong>Email:</strong> privacy@yourdomain.com
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