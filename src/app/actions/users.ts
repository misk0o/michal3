"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany({
      where: searchTerm ? {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      } : {}, // If no search term, this will return all users
      orderBy: {
        name: 'asc', // Optional: order results alphabetically
      },
      take: 50, // Limit results, adjust as needed
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Could not search users");
  }
};

export async function fetchUserProfile(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followers: true,
        following: true,
        profile: true
      }
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function updateUserProfile(data: {
  name?: string;
  bio?: string;
  location?: string;
  image?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return null;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name,
        profile: {
          upsert: {
            create: {
              bio: data.bio,
              location: data.location,
              avatarUrl: data.image
            },
            update: {
              bio: data.bio,
              location: data.location,
              avatarUrl: data.image
            }
          }
        }
      },
      include: {
        profile: true
      }
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}

export async function followUser(targetUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return null;

    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: targetUserId
      }
    });

    return true;
  } catch (error) {
    console.error("Error following user:", error);
    return null;
  }
}

export async function unfollowUser(targetUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return null;

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId
        }
      }
    });

    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return null;
  }
} 