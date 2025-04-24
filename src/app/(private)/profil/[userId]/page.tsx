import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import { notFound } from "next/navigation";
import ProfileView from "@/sections/ProfileView";

export const metadata: Metadata = {
  title: "Profil používateľa",
  description: "Zobraziť profil používateľa",
};

async function getProfileData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      profile: {
        select: {
          id: true,
          bio: true,
          avatarUrl: true,
          location: true,
          interests: true,
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
      posts: {
        select: {
          id: true,
          caption: true,
          images: {
            select: {
              imageUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return user;
}

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const userData = await getProfileData(params.userId);
  if (!userData) notFound();

  // Create default profile if it doesn't exist
  const profile = userData.profile || {
    id: "",
    userId: userData.id,
    bio: null,
    avatarUrl: null,
    location: null,
    interests: [],
  };

  const stats = {
    postsCount: userData._count.posts,
    followersCount: userData._count.followers,
    followingCount: userData._count.following,
  };

  return (
    <ProfileView
      profile={profile}
      user={userData}
      posts={userData.posts}
      stats={stats}
      isOwnProfile={session.user.email === userData.email}
    />
  );
} 