import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ZAxis } from "recharts";
import { success } from "zod";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // // TODO: Fetch project by ID using the id parameter
    const project = await prisma.project.findFirst({
      where: {
        userId: user.id,
        id: id,
      },
      include: {
        frames: true,
      },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    console.log(`Fetching project ${id} for user ${user.id}`);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Errorin fetching the project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1️⃣ Get authenticated user
    const session = getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Extract params & body
    const { id } = params;
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid prompt" },
        { status: 400 }
      );
    }

    // 3️⃣ Fetch project safely
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        frames: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 4️⃣ Trigger background job (fire & forget)
    await inngest.send({
      name: "ui/generate-screen",
      data: {
        userId: user.id,
        projectId: id,
        prompt,
        frames: project.frames,
        theme: project.theme,
      },
    });

    // 5️⃣ Return response
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Error fetching the project:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { themeId } = await req.json();
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!themeId) {
      return NextResponse.json({ error: "Missing themeId" }, { status: 400 });
    }
    const userId = user?.id;

    const project = await prisma.project.update({
      where: {
        id,
        userId,
      },
      data: {
        theme: themeId,
      },
    });
    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.log("Error updating project theme");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
