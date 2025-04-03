"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { Post, User } from "@prisma/client"; // Ensure to import types

// Fetch all posts, including the user who created them
export const fetchPosts = async (): Promise<(Post & { user: User })[]> => { // Add types for user inclusion
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        bookmarks: {
          include: {
            user: true
          }
        },
        images: true
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by a specific user ID, including the user details
export const fetchPostsByUserId = async (userId: string): Promise<(Post & { user: User })[]> => { // Add types for user inclusion
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        comments: {
          include: {
            user: true
          }
        },
        likes: {
          include: {
            user: true
          }
        },
        bookmarks: {
          include: {
            user: true
          }
        }
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post, no change needed here
export const createPost = async (userId: string, imageUrl: string, caption?: string): Promise<Post> => { // Specify return type
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
};
