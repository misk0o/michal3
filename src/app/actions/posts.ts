"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { Post, User } from "@prisma/client"; // Ensure to import types
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

// Fetch all posts, including the user who created them
export async function fetchPosts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        images: true,
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Fetch posts by a specific user ID, including the user details
export async function fetchPostsByUserId(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId
      },
      include: {
        user: true,
        images: true,
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
      orderBy: {
        createdAt: 'desc'
      }
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

// Create a new post, no change needed here
export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return null;

    const description = formData.get("description") as string;
    const images = formData.getAll("images") as File[];

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        caption: description,
        images: {
          create: images.map((image, index) => ({
            imageUrl: URL.createObjectURL(image),
            order: index
          }))
        }
      },
      include: {
        user: true,
        images: true
      }
    });

    revalidatePath('/prispevok');
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

export async function deletePost(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return null;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== user.id) {
      return null;
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath('/prispevok');
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return null;
  }
}
