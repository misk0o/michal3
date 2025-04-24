"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

interface UpdateProfileParams {
  userId: string;
  name: string;
  bio: string;
  image: File | null;
}

export async function updateProfile({
  userId,
  name,
  bio,
  image,
}: UpdateProfileParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser || currentUser.id !== userId) {
    throw new Error("Unauthorized");
  }

  let imageUrl = currentUser.image;

  if (image) {
    const blob = await put(`profile-images/${userId}`, image, {
      access: 'public',
      addRandomSuffix: true
    });
    imageUrl = blob.url;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      image: imageUrl,
      profile: {
        upsert: {
          create: { bio },
          update: { bio },
        },
      },
    },
  });

  revalidatePath(`/profil/${userId}`);
  revalidatePath(`/profil/${userId}/upravit`);

  return updatedUser;
} 