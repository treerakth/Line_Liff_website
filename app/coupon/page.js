"use client";
import CouponCard from "@/app/component/couponCard";
import styles from "@/app/styles/styles.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { initializeLiff } from "@/utils/liff";
import BottomBar from "../component/bottombar";
import FireIcon from "../component/fireicon";

export default function CouponPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [userData, setUserData] = useState({
    first_name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function initLiff() {
      try {
        const liff = await initializeLiff();
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        const res = await fetch(`/api/users?id=${userProfile.userId}`);
        if (res.ok) {
          const u = await res.json();
          if (!u.error) {
            setUserData({
              phone: u.phone || "",
              email: u.email || "",
              first_name: u.first_name || "",
            });
          }
        }
      } catch (err) {
        console.error("Error initializing LIFF:", err);
      } finally {
        setLoading(false);
      }
    }
    initLiff();
  }, [router]);

  useEffect(() => {
    async function loadCoupons() {
      try {
        const res = await fetch("/api/coupons");
        if (!res.ok) throw new Error("Failed to fetch coupons");
        const data = await res.json();
        console.log("[Client] coupons from DB:", data.length, data);
        setCoupons(data);
      } catch (err) {
        console.error("Fetch coupons error:", err);
      }
    }
    loadCoupons();
  }, []);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = coupons.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div
      className={`max-w-md mx-auto bg-white w-full flex flex-col ${styles.fonts}`}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
        </div>
      ) : (
        <div className="py-4 px-4">
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
                  คุณ {userData.first_name || profile?.displayName}
                </div>
              </div>
            </div>
          )}
          {/* <header className="w-full h-48 overflow-hidden"> */}
          {/* Banner or carousel here */}
          {/* </header> */}

          <main className="flex-1 pb-24">
            <div className="w-full mb-4 h-[128px] bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer">
              Wait for image
            </div>
            <div className="m-2 mb-5">
              <p className="text-[20px] font-bold">เก็บโค้ดส่วนลด</p>
              <p className="text-[15px]">
                Line Account Advice
                ยินดีต้อนรับสู่แคมเปญโค้ดส่วนลดคุณสามารถเลือกแคมเปญที่คุณสนใจได้เลย
              </p>
            </div>
            <div className="flex items-center mb-2">
              <FireIcon />
              <h3 className="text-[17px] font-semibold">แคมเปญโค้ดส่วนลด</h3>
            </div>
            {/* Coupon grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-0">
              {paginated.map((c) => (
                <div
                  key={c.id}
                  onClick={() => router.push(`/coupon/detail/${c.code}`)}
                  className="mb-2 cursor-pointer"
                >
                  <CouponCard
                    coupon={{
                      image_url: c.image_url,
                      header: c.header,
                      description: c.description,
                      term: c.term,
                      valid_until: c.valid_until,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                {/* Prev */}
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border bg-white text-gray-700 disabled:opacity-50"
                >
                  ⏮
                </button>

                {/* เลขหน้า แบบปุ่ม */}
                {Array.from({ length: totalPages }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={
                        `px-3 py-1 border rounded-lg ` +
                        (currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100")
                      }
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next */}
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
          <BottomBar />
        </div>
      )}
    </div>
  );
}
