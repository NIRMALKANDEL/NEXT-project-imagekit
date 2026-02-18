import { authOptions } from "@/Lib/auth";
import { connectToDatabase } from "@/Lib/db";
import Video, { IVideo } from "@/Models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json(
        { message: "No videos found" },
        { status: 404 }
      );
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error in video GET /api/video:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body: IVideo = await request.json();

    if (!body.title || !body.description || !body.videoUrl) {
      return NextResponse.json(
        { message: "Title, description and videoUrl are required" },
        { status: 400 }
      );
    }

    const videoData = {
      ...body,
      controls: true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transform?.quality || 100,
      },
    };

    const newVideo = await Video.create(videoData);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Error in video POSTing  /api/videogo:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
