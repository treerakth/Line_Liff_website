// app/api/users/route.js
import { NextResponse } from "next/server";
import pool from "@/app/database/db";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const line_userid = url.searchParams.get("id");

    if (!line_userid) {
      // ถ้าไม่มี id ให้ถือว่าผิดพารามิเตอร์
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    // ดึง field ทั้งหมด รวมถึงแปลง birth_date ให้อยู่ใน 'YYYY-MM-DD'
    const [rows] = await pool.query(
      `
      SELECT
        id,
        line_userid,
        line_displayname,
        line_pictureURL,
        phone,
        email,
        gender,
        first_name,
        last_name,
        DATE_FORMAT(birth_date, '%Y-%m-%d') AS birth_date,
        citizen_id,
        address,
        sub_district,
        district,
        province,
        postal_code,
        created_at,
        updated_at
      FROM users
      WHERE line_userid = ?
      `,
      [line_userid]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // คืนเป็นอ็อบเจ็กต์เดียว
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      line_userid,
      line_displayname,
      line_pictureURL,
      phone,
      email,
      gender,
      first_name,
      last_name,
      birth_date,
      citizen_id,
      address,
      sub_district,
      district,
      province,
      postal_code,
    } = body;

    if (!line_userid) {
      return NextResponse.json(
        { error: "Missing line_userid" },
        { status: 400 }
      );
    }

    // upsert: ถ้าไม่มีเรคอร์ดก็ INSERT, ถ้ามีแล้วก็ UPDATE ตาม field ที่ส่งมา
    const sql = `
      INSERT INTO users (
        line_userid,
        line_displayname,
        line_pictureURL,
        phone,
        email,
        gender,
        first_name,
        last_name,
        birth_date,
        citizen_id,
        address,
        sub_district,
        district,
        province,
        postal_code
      ) VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
      ON DUPLICATE KEY UPDATE
        line_displayname = VALUES(line_displayname),
        line_pictureURL  = VALUES(line_pictureURL),
        phone            = VALUES(phone),
        email            = VALUES(email),
        gender           = VALUES(gender),
        first_name       = VALUES(first_name),
        last_name        = VALUES(last_name),
        birth_date       = VALUES(birth_date),
        citizen_id       = VALUES(citizen_id),
        address          = VALUES(address),
        sub_district     = VALUES(sub_district),
        district         = VALUES(district),
        province         = VALUES(province),
        postal_code      = VALUES(postal_code)
    `;
    const params = [
      line_userid,
      line_displayname,
      line_pictureURL,
      phone,
      email,
      gender,
      first_name,
      last_name,
      birth_date,
      citizen_id,
      address,
      sub_district,
      district,
      province,
      postal_code,
    ];

    await pool.query(sql, params);
    return NextResponse.json({ message: "Profile saved" }, { status: 200 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
