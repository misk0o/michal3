// src/app/(private)/prispevok/page.tsx

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PostView from "@/sections/PostView";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function PostPage() {
  const session = await getServerSession(authOptions);

  return(
    <Container>
      <Typography variant="h3" gutterBottom>
        Vitajte, {session?.user?.name}!
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 5, fontSize: 20 }}>
        Toto sú najnovšie príspevky.
      </Typography>
      <PostView/>
    </Container>
  );
}