import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import EditProfileForm from "@/sections/EditProfileForm";

export const metadata: Metadata = {
  title: "Upraviť profil",
  description: "Upravte si svoj profil",
};

export default async function EditProfilePage({ params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = params.userId;
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // Get current user ID from email
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!currentUser) {
    throw new Error("User not found");
  }

  // Only allow users to edit their own profile
  if (currentUser.id !== userId) {
    redirect(`/profil/${userId}`);
  }

  // Get user data for the form
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return <EditProfileForm user={user} />;
} 