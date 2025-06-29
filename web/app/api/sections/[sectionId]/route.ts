import { getResourceSectionById } from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    const { sectionId } = await params;
    const section = await getResourceSectionById(sectionId);

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Failed to fetch section:", error);
    return NextResponse.json(
      { error: "Failed to fetch section" },
      { status: 500 }
    );
  }
}
