//src/app/profil/page.tsx

import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

export const metadata: Metadata = {
  title: "Profil",
  description: "Váš profil",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get user ID from email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Redirect to user's profile
  redirect(`/profil/${user.id}`);
}