import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({
        message: "Unauthenticated"
      }, {
        status: 403
      });
    }

    // Look up the user by email to get their ID
    const user = await prismaClient.user.findFirst({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({
        message: "User not found"
      }, {
        status: 404
      });
    }

    const resolvedParams = await params;
    const streamId = resolvedParams.id;

    // Check if the stream exists and belongs to the user
    const stream = await prismaClient.stream.findFirst({
      where: {
        id: streamId,
        userId: user.id
      }
    });

    if (!stream) {
      return NextResponse.json({
        message: "Stream not found or you don't have permission to delete it"
      }, {
        status: 404
      });
    }

    // Delete all upvotes for this stream first (due to foreign key constraints)
    await prismaClient.upvote.deleteMany({
      where: {
        streamId: streamId
      }
    });

    // Delete the stream
    await prismaClient.stream.delete({
      where: {
        id: streamId
      }
    });

    return NextResponse.json({
      message: "Stream deleted successfully"
    });

  } catch (error) {
    console.error('Error deleting stream:', error);
    return NextResponse.json({
      message: "Error deleting stream"
    }, {
      status: 500
    });
  }
} 