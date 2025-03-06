"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { User } from "@prisma/client";

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