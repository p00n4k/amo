import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mime from "mime"; // ถ้าไม่ได้ลง mime ให้ใช้ logic เช็คสกุลไฟล์แบบ manual ตามโค้ดเดิม

export async function GET(
  req: Request,
  // ✅ แก้ไข Type ตรงนี้: params เป็น Promise
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    // ✅ เพิ่ม await ตรงนี้ก่อนดึง slug ออกมา
    const { slug } = await params;

    // สร้าง path ไปยังไฟล์จริง (โฟลเดอร์ uploads ที่ root)
    const filePath = path.join(process.cwd(), "uploads", ...slug);

    // เช็คว่ามีไฟล์จริงไหม
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // อ่านไฟล์
    const fileBuffer = fs.readFileSync(filePath);

    // หา Content-Type
    const contentType = mime.getType(filePath) || "application/octet-stream";

    // ส่งไฟล์กลับไป
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}