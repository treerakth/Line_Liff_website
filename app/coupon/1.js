"use client";
import CouponCard from "@/app/component/couponCard";
import styles from "@/app/styles/styles.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { initializeLiff } from "@/utils/liff";

export default function CouponPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initLiff() {
      try {
        const liff = await initializeLiff();
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        const profile = await liff.getProfile();
        setProfile(profile);
      } catch (err) {
        console.error("Error initializing LIFF:", err);
      } finally {
        setLoading(false);
      }
    }
    initLiff();
  }, [router]);

  const coupons = [
    {
      image_url: "https://i.postimg.cc/8znzR5BP/575-800x600.jpg",
      term: "ไม่มีขั้นต่ำในการใช้งาน",
      description: "ส่วนลด 5%",
      head: "03/25 Advice สุดเท่",
      expire_date: "31 มีนาคม 2568",
      path: "/coupon/detail",
    },
    {
      image_url: "https://i.postimg.cc/1zn5JQJ0/529-800x600.jpg",
      term: "ต้องซื้อขั้นต่ำ 5,000 บาท",
      description: "ส่วนลด 10%",
      head: "04/25 Advice สุดจ๊าบ",
      expire_date: "30 เมษายน 2568",
      path: "/coupon/detail",
    },
    {
      image_url: "https://i.postimg.cc/QBR5094j/1.jpg",
      term: "ไม่มีขั้นต่ำในการใช้งาน",
      description: "ส่วนลด 5%",
      head: "05/25 แนะนำสุดคูล",
      expire_date: "31 พฤษภาคม 2568",
      path: "/coupon/detail",
    },
    {
      image_url: "https://i.postimg.cc/XGd5hjmd/2.jpg",
      term: "ต้องซื้อขั้นต่ำ 1,000 บาท",
      description: "รับฟรีของแถมมูลค่า 200 บาท",
      head: "06/25 ดีลพิเศษ",
      expire_date: "30 มิถุนายน 2568",
      path: "/coupon/detail",
    },
    {
      image_url: "https://i.postimg.cc/ctcnxDsJ/3.jpg",
      term: "เฉพาะสมาชิก VIP",
      description: "ส่วนลด 15%",
      head: "07/25 สาวก VIP ห้ามพลาด",
      expire_date: "31 กรกฎาคม 2568",
      path: "/coupon/detail",
    },
    {
      image_url: "https://i.postimg.cc/WqVZPRcK/4.jpg",
      term: "ช้อปครบ 2 ชิ้นขึ้นไป",
      description: "รับฟรีค่าจัดส่ง",
      head: "08/25 จัดส่งฟรีทั่วไทย",
      expire_date: "31 สิงหาคม 2568",
      path: "/coupon/detail",
    },
    {
      image_url: "https://i.postimg.cc/p99zfYB0/5.jpg",
      term: "ใช้ได้เฉพาะวันจันทร์ ถึง วันศุกร์",
      description: "ส่วนลด 8%",
      head: "09/25 วันธรรมดาก็ฟิน",
      expire_date: "30 กันยายน 2568",
      path: "/coupon/detail",
    },
  ];

  // ข้อมูล Banner (ใส่เป็น array แล้วเปลี่ยนตามต้องการได้)
  // const banners = [
  //     '/banners/banner1.jpg',
  //     '/banners/banner2.jpg',
  //     // …
  // ]
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = coupons.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div
      className={`bg-white w-full min-h-screen flex flex-col ${styles.fonts}`}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
        </div>
      ) : (
        <>
          {profile && (
            <div
              className={styles.profileBox}
              onClick={() => router.push("/my-profile")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={profile.pictureUrl}
                alt="Profile"
                className={styles.profileImage}
              />
              <div>
                <div className={styles.profileText}>Line Account</div>
                <div className={styles.profileSubtext}>
                  คุณ: {profile.displayName}
                </div>
              </div>
            </div>
          )}
          {/* <header className="w-full h-48 overflow-hidden"> */}
          {/* Banner or carousel here */}
          {/* </header> */}

          <main className="flex-1 p-4 pb-24">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {paginatedCoupons.map((c, i) => (
                <div
                  key={i}
                  onClick={() => router.push(c.path)}
                  className="-mt-2 cursor-pointer hover:opacity-90"
                >
                  <CouponCard coupon={c} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border bg-white text-gray-700 disabled:opacity-50"
                >
                  ⏮
                </button>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                  className="px-2 py-1 border rounded-lg"
                >
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <option key={idx + 1} value={idx + 1}>
                      {idx + 1}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border bg-white text-gray-700 disabled:opacity-50"
                >
                  ⏭
                </button>
              </div>
            )}
          </main>

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
            <button
              onClick={() => router.push("/")}
              className={styles.menuButton}
            >
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
        </>
      )}
    </div>
  );
}
