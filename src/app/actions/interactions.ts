"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath } from "next/cache";

// Like/Unlike post
export async function toggleLike(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return null;

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: user.id,
        postId: postId,
      },
    });
  }

  revalidatePath('/prispevok');
  return !existingLike;
}

// Add comment
export async function addComment(postId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return null;

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: user.id,
      postId,
    },
    include: {
      user: true,
    },
  });

  revalidatePath('/prispevok');
  return comment;
}

// Delete comment
export async function deleteComment(commentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return null;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.userId !== user.id) {
    return null;
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  revalidatePath('/prispevok');
  return true;
}

// Toggle bookmark
export async function toggleBookmark(postId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return null;

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId: postId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        postId: postId,
      },
    });
  }

  revalidatePath('/prispevok');
  return !existingBookmark;
}

// Fetch bookmarked posts
export async function fetchBookmarkedPosts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return [];

  const bookmarkedPosts = await prisma.post.findMany({
    where: {
      bookmarks: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      user: true,
      likes: true,
      comments: {
        include: {
          user: true,
        },
      },
      bookmarks: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookmarkedPosts;
} 