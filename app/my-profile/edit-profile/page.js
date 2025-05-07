"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "@/app/styles/styles.module.css";
import { showSuccessAlert, showErrorAlert } from "@/utils/alert";
import { initializeLiff } from "@/utils/liff";

export default function EditProfile() {
  const router = useRouter();

  const [lineUserId, setLineUserId] = useState("");
  const [lineDisplayName, setLineDisplayName] = useState("");
  const [linePictureURL, setLinePictureURL] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [address, setAddress] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        // 1) initialize LIFF and ensure logged in
        const liff = await initializeLiff();
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        // 2) get LINE profile
        const { userId, displayName, pictureUrl } = await liff.getProfile();
        setLineUserId(userId);
        setLineDisplayName(displayName);
        setLinePictureURL(pictureUrl);

        // 3) fetch our DB record
        const res = await fetch(`/api/users?id=${encodeURIComponent(userId)}`);
        if (!res.ok) {
          console.error("failed to fetch user:", res.status);
          return;
        }
        const u = await res.json();
        if (u.error) {
          console.error("API error:", u.error);
          return;
        }

        // 4) map to state (note: birth_date is 'YYYY-MM-DD')
        setPhone(u.phone || "");
        setEmail(u.email || "");
        setGender(u.gender || "");
        setFirstName(u.first_name || "");
        setLastName(u.last_name || "");
        setBirthDate(u.birth_date || "");
        setCitizenId(u.citizen_id || "");
        setAddress(u.address || "");
        setSubDistrict(u.sub_district || "");
        setDistrict(u.district || "");
        setProvince(u.province || "");
        setPostalCode(u.postal_code || "");
      } catch (err) {
        console.error("loadProfile error", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSave = async () => {
    try {
      const body = {
        line_userid: lineUserId,
        line_displayname: lineDisplayName,
        line_pictureURL: linePictureURL,
        phone,
        email,
        gender,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        citizen_id: citizenId,
        address,
        sub_district: subDistrict,
        district,
        province,
        postal_code: postalCode,
      };

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");
      await showSuccessAlert(
        "บันทึกสำเร็จ",
        "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
        "/my-profile"
      );
    } catch (err) {
      await showErrorAlert(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง"
      );
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }
  return (
    <div className={`flex flex-col min-h-screen bg-white ${styles.fonts}`}>
      <div className="max-w-md mt-10 mx-auto px-4 py-6 space-y-6">
        <h1 className="text-xl font-bold mb" style={{ margin: "unset" }}>
          บัญชี Line OA
        </h1>
        <p className="text-sm text-gray-600">
          บัญชี Line OA ทำให้ทุกบริการที่คุณใช้เหมาะกับคุณ
          เพียงลงชื่อเข้าใช้บัญชีเพื่อเข้าถึงค่าที่กำหนด
          รวมถึงการควบคุมความเป็นส่วนตัวและการปรับเปลี่ยนในแบบของคุณจากอุปกรณ์ใดก็ได้.
        </p>

        {/* เบอร์โทรศัพท์ */}
        <div className="relative mt-4">
          <label
            htmlFor="phone"
            className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
          >
            เบอร์โทรศัพท์
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* อีเมล */}
        <div className="relative mt-4">
          <label
            htmlFor="email"
            className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
          >
            อีเมล
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* ข้อมูลส่วนตัว */}
        <h2 className="text-lg font-semibold mt-6">ข้อมูลส่วนตัว</h2>
        <p className="text-xs text-gray-600">
          ข้อมูลส่วนบุคคลที่มีข้อมูลอ่อนไหว มีอะไรบ้าง เชื้อชาติ เผ่าพันธุ์
          ความเห็นทางการเมือง ความเชื่อในลัทธิ ศาสนาหรือปรัชญา พฤติกรรมทางเพศ
          ประวัติอาชญากรรม
        </p>

        <div className="grid grid-cols-3 gap-4">
          {/* เพศ */}
          <div className="relative">
            <label
              htmlFor="gender"
              className={`absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
            >
              เพศ
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="text-sm w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="" hidden disabled>
                เพศ
              </option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>

          {/* ชื่อ */}
          <div className="relative">
            <label
              htmlFor="firstName"
              className={`absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
            >
              ชื่อ
            </label>
            <input
              id="firstName"
              name="first_name"
              type="text"
              placeholder="ชื่อ"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* นามสกุล */}
          <div className="relative">
            <label
              htmlFor="lastName"
              className={`absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-700 font-semibold ${styles.requiredLabel}`}
            >
              นามสกุล
            </label>
            <input
              id="lastName"
              name="last_name"
              type="text"
              placeholder="นามสกุล"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* วันเกิด */}
          <div className="relative">
            <label
              htmlFor="birthdate"
              className={`absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
            >
              วันเกิด
            </label>
            <input
              id="birthdate"
              name="birth_date"
              type="date"
              value={birthDate} // <-- ผูก value
              onChange={(e) => setBirthDate(e.target.value)} // <-- อัปเดต state
              className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* หมายเลขบัตรประชาชน */}
          <div className="relative s">
            <label
              htmlFor="citizenId"
              className={`absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
            >
              หมายเลขบัตรประชาชน
            </label>
            <input
              id="citizenId"
              name="citizen_id"
              type="text"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              placeholder="__-___-___-_____"
              className="text-gray-700 text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* ที่อยู่ */}
        <h2 className="text-lg font-semibold" style={{ margin: "initial" }}>
          ที่อยู่
        </h2>
        <p className="text-xs text-gray-600 mb-5">
          ใช้เพื่อบอกที่ตั้งของอาคาร อพาร์ตเมนต์ หรือโครงการอื่นๆ
          โดยไม่ใช้เขตทางการเมือง
        </p>
        <div className="space-y-4">
          <div className="relative mt-4">
            <label
              htmlFor="address"
              className={`absolute -top-3 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
            >
              ที่อยู่
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="ที่อยู่ / อาคาร / ชั้น / ถนน / ซอย"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="relative">
              <label
                htmlFor="subDistrict"
                className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
              >
                แขวง/ตำบล
              </label>
              <input
                id="subDistrict"
                name="sub_district"
                type="text"
                placeholder="แขวง หรือ ตำบล"
                value={subDistrict}
                onChange={(e) => setSubDistrict(e.target.value)}
                className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="district"
                className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
              >
                เขต/อำเภอ
              </label>
              <input
                id="district"
                name="district"
                type="text"
                placeholder="เขต หรือ อำเภอ"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="province"
                className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
              >
                จังหวัด
              </label>
              <input
                id="province"
                name="province"
                type="text"
                placeholder="จังหวัด"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
          <div className="relative">
            <label
              htmlFor="postalcode"
              className={`absolute -top-2 left-3 bg-white px-1 text-xs font-semibold text-gray-700 ${styles.requiredLabel}`}
            >
              รหัสไปรษณีย์
            </label>
            <input
              id="postalcode"
              name="postal_code"
              type="text"
              placeholder="รหัสไปรษณีย์"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="text-sm peer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        {/* บันทึกโปรไฟล์ */}
        <button
          onClick={handleSave}
          className="cursor-pointer mb-10 mt-6 w-full bg-green-500 text-white py-3 rounded-md flex items-center justify-center space-x-2"
        >
          <span>บันทึกโปรไฟล์</span>
        </button>
      </div>
      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomBar}>
        {/* โค้ดส่วนลด */}
        <button
          onClick={() => router.push("/my-coupons")}
          className={styles.menuButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            viewBox="0 0 21 20"
            fill="black"
          >
            <path d="m21 5h-1-2-12-2-1c-.553 0-1 .447-1 1v1 1.938 1.062h.893c.996 0 1.92.681 2.08 1.664.204 1.253-.758 2.336-1.973 2.336h-1v1.062 1.938 1c0 .553.447 1 1 1h1 2 12 2 1c.553 0 1-.447 1-1v-1-1.938-1.062s-.447 0-1 0c-1.215 0-2.177-1.083-1.973-2.336.16-.983 1.084-1.664 2.08-1.664h.893v-1.062-1.938-1c0-.553-.447-1-1-1zm-10 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2z" />
          </svg>
        </button>
        {/* เก็บโค้ด */}
        <button
          onClick={() => router.push("/coupon")}
          className={styles.menuButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            viewBox="0 0 23 23"
            fill="none"
          >
            <g
              xmlns="http://www.w3.org/2000/svg"
              stroke="#333"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="m11.5808 5.10265 9.7613 9.76125-7.4782 7.4782-9.76127-9.7613-.36363-7.84179z" />
              <path d="m7 8v.01" />
              <path d="m12 11 4.2427 4.2426m-6.2427-2.2426 4.2427 4.2426" />
            </g>
          </svg>
        </button>
        {/* หน้าแรก */}
        <button onClick={() => router.push("/")} className={styles.menuButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-6 mx-auto"
            viewBox="0 0 28 30"
            fill="black"
          >
            <path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16 11.543l8.25 6.186z" />
          </svg>
        </button>
        {/* QR Account */}
        <button
          onClick={() => router.push("/add-friend")}
          className={styles.menuButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            viewBox="0 0 24 24"
            fill="black"
          >
            <path
              d="m4 4h6v6h-6zm16 0v6h-6v-6zm-6 11h2v-2h-2v-2h2v2h2v-2h2v2h-2v2h2v3h-2v2h-2v-2h-3v2h-2v-4h3zm2 0v3h2v-3zm-12 5v-6h6v6zm2-14v2h2v-2zm10 0v2h2v-2zm-10 10v2h2v-2zm-2-5h2v2h-2zm5 0h4v4h-2v-2h-2zm2-5h2v4h-2zm-9-4v4h-2v-4a2 2 0 0 1 2-2h4v2zm20-2a2 2 0 0 1 2 2v4h-2v-4h-4v-2zm-20 18v4h4v2h-4a2 2 0 0 1 -2-2v-4zm20 4v-4h2v4a2 2 0 0 1 -2 2h-4v-2z"
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {/* โปรไฟล์ */}
        <button
          onClick={() => router.push("/my-profile")}
          className={styles.menuButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            viewBox="0 0 24 24"
            fill="black"
          >
            <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
