import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "../../auth/[...nextauth]/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

// Helper function to generate unique filename
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const extension = originalFilename.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const caption = formData.get("description") as string;
    const imageFiles: File[] = [];

    // Collect all image files
    for (let i = 0; i < 3; i++) {
      const file = formData.get(`image${i}`) as File;
      if (file) {
        imageFiles.push(file);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await writeFile(join(uploadDir, ".keep"), "");
    } catch (error) {
      // Directory already exists or cannot be created
    }

    // Create post in database
    const post = await prisma.post.create({
      data: {
        caption,
        userId: user.id, // Use the correct user ID
      },
    });

    // Save images
    const uploadPromises = imageFiles.map(async (file, index) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const uniqueFilename = generateUniqueFilename(file.name);
      const filePath = join(uploadDir, uniqueFilename);

      // Save file
      await writeFile(filePath, buffer);

      // Create image record in database
      return prisma.postImage.create({
        data: {
          postId: post.id,
          imageUrl: `/uploads/${uniqueFilename}`,
          order: index,
        },
      });
    });

    await Promise.all(uploadPromises);

    return NextResponse.json({ success: true, postId: post.id });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
} 