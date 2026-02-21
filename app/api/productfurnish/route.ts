import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ GET
export async function GET() {
  try {
    const connection = await getConnection();
    const [rows]: any = await connection.query(`
      SELECT item_id, image, link
      FROM product_furnish_items
      ORDER BY item_id DESC
    `);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("GET /productfurnish error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST
export async function POST(req: Request) {
  try {
    const { image, link } = await req.json();
    if (!image || !link)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      INSERT INTO product_furnish_items (image, link)
      VALUES (?, ?)
      `,
      [image, link]
    );
    await connection.end();

    return NextResponse.json({ message: "Furnish item added successfully" });
  } catch (error: any) {
    console.error("POST /productfurnish error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT
export async function PUT(req: Request) {
  try {
    const { item_id, image, link } = await req.json();
    if (!item_id)
      return NextResponse.json({ error: "Missing item_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `
      UPDATE product_furnish_items
      SET image = COALESCE(?, image),
          link = COALESCE(?, link)
      WHERE item_id = ?
      `,
      [image, link, item_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Furnish item updated successfully" });
  } catch (error: any) {
    console.error("PUT /productfurnish error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req: Request) {
  try {
    const { item_id } = await req.json();
    if (!item_id)
      return NextResponse.json({ error: "Missing item_id" }, { status: 400 });

    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM product_furnish_items WHERE item_id = ?`,
      [item_id]
    );
    await connection.end();

    return NextResponse.json({ message: "Furnish item deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /productfurnish error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
