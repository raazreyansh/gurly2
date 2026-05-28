import { NextResponse } from "next/server"
import { deleteServerProduct } from "@/services/server-catalog"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    await deleteServerProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete product from server fallback catalogue:", error)
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 })
  }
}
