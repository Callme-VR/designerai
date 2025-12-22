import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
                    id: id
               },
               include: {
                    frames: true,
               }
          })
          if(!project){
               return NextResponse.json({ error: "Project not found" }, { status: 404 });
          }
          console.log(`Fetching project ${id} for user ${user.id}`);
          return NextResponse.json(project);
     } catch (error) {
          console.error("Errorin fetching the project:", error);
          return NextResponse.json({ error: "Internal server error" }, { status: 500 });
     }
}