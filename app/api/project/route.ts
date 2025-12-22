import { generateProjectName } from "@/app/actions/action"
import prisma from "@/lib/prisma"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const session = await getKindeServerSession()
    const user = await session.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const projectName = await generateProjectName(prompt)

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: projectName,
      },
    })

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error("Project creation failed:", error)

    // ✅ still return a response
    return NextResponse.json(
      { error: "Project creation Failed" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {

  try {
    const session = await getKindeServerSession()
    const user = await session.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id
      },
      take: 15,
      orderBy: {
        updatedAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      data: projects
    })
  }
  catch (error) {
    console.error("Project creation failed:", error)

    // ✅ still return a response
    return NextResponse.json(
      { error: "Project creation Failed" },
      { status: 500 }
    )
  }
}