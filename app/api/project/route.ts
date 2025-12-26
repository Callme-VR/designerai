import { generateProjectName } from "@/app/actions/action";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      take: 15,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Project creation failed:", error);
    return NextResponse.json(
      { error: "Project creation Failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const projectName = await generateProjectName(prompt);

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: projectName,
      },
    });

    try {
      await inngest.send({
        name: "ui/generate-screen",
        data: {
          userId: user.id,
          projectId: project.id,
          prompt,
        },
      });
    } catch (error) {
      console.error("Failed to trigger inngest function:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Inngest trigger failed: ${errorMessage}`);
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Project creation failed:", error);

    return NextResponse.json(
      { error: "Project creation Failed" },
      { status: 500 }
    );
  }
}
