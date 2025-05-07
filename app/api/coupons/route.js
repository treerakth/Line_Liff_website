import pool from "@/app/database/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    // ดึงคูปองเดียวตามโค้ด (หากมีการระบุ)
    if (code) {
      const [rows] = await pool.query(
        `SELECT
           id,
           code,
           header,
           description,
           term,
           valid_from,
           valid_until,
           image_url,
           status
         FROM coupons
         WHERE code = ?
           AND status = 'available'
           AND valid_until >= CURDATE()
         LIMIT 1`,
        [code]
      );
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: "ไม่พบคูปอง" }), {
          status: 404,
        });
      }
      return new Response(JSON.stringify(rows[0]), { status: 200 });
    }

    // ดึงคูปองทั้งหมด
    const [all] = await pool.query(
      `SELECT
         id,
         code,
         header,
         description,
         term,
         valid_from,
         valid_until,
         image_url,
         status
       FROM coupons
       WHERE status = 'available'
         AND valid_until >= CURDATE()
       ORDER BY valid_until ASC`
    );
    console.log("[API /api/coupons] fetched coupons:", all.length);
    return new Response(JSON.stringify(all), { status: 200 });
  } catch (error) {
    console.error("GET /api/coupons error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
