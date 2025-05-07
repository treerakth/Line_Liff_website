import pool from "@/app/database/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const line_userid = searchParams.get("line_userid");
    if (!line_userid) {
      return new Response(JSON.stringify({ error: "Missing line_userid" }), {
        status: 400,
      });
    }

    const query = `
      SELECT
        uc.id,
        c.code,
        c.description,
        c.header,
        c.term,
        c.valid_from,
        c.valid_until,
        c.status AS coupon_status,
        c.image_url
      FROM userCoupons uc
      JOIN coupons c ON uc.coupon_id = c.id
      JOIN users u ON uc.user_id = u.id
      WHERE u.line_userid = ?
        AND c.valid_until >= CURDATE()
      ORDER BY uc.created_at DESC
    `;
    const [rows] = await pool.query(query, [line_userid]);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("GET /api/userCoupons error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { line_userid, coupon_id } = body;

    if (!line_userid || !coupon_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ตรวจสอบว่าผู้ใช้เก็บคูปองนี้ไปแล้วหรือไม่
    const checkQuery = `
      SELECT uc.id
      FROM userCoupons uc
      JOIN users u ON uc.user_id = u.id
      WHERE u.line_userid = ?
        AND uc.coupon_id = ?
    `;
    const [existing] = await pool.query(checkQuery, [line_userid, coupon_id]);
    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "Coupon already collected" }),
        { status: 409 }
      );
    }

    // ดึง user id
    const [users] = await pool.query(
      "SELECT id FROM users WHERE line_userid = ?",
      [line_userid]
    );
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    const userId = users[0].id;

    // บันทึกข้อมูลลง userCoupons
    const [result] = await pool.query(
      "INSERT INTO userCoupons (user_id, coupon_id) VALUES (?, ?)",
      [userId, coupon_id]
    );

    return new Response(
      JSON.stringify({
        message: "Coupon collected",
        userCouponId: result.insertId,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/userCoupons error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
