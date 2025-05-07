"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { initializeLiff } from "@/utils/liff";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
import styles from "@/app/styles/styles.module.css";

export default function DetailCoupon() {
  const { code } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [coupon, setCoupon] = useState(null);

  // Initialize LIFF and get user profile
  useEffect(() => {
    async function loadLiff() {
      try {
        const liff = await initializeLiff();
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        const prof = await liff.getProfile();
        setProfile(prof);
      } catch (err) {
        console.error("LIFF init error:", err);
      }
    }
    loadLiff();
  }, [router]);

  // Fetch coupon data by code
  useEffect(() => {
    if (!code) return;
    async function fetchCoupon() {
      try {
        const res = await fetch(`/api/coupons?code=${code}`);
        if (!res.ok) throw new Error("ไม่พบข้อมูลคูปอง");
        const data = await res.json();
        setCoupon(data);
      } catch (err) {
        showErrorAlert("ผิดพลาด", err.message);
      }
    }
    fetchCoupon();
  }, [code]);

  // Handle coupon collection
  const handleClick = async () => {
    try {
      const res = await fetch("/api/userCoupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_userid: profile?.userId || profile?.sub,
          coupon_id: coupon.id,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "เกิดข้อผิดพลาด");
      await showSuccessAlert(
        "สำเร็จ",
        "ลงทะเบียนรับคูปองสำเร็จแล้ว",
        "/coupon"
      );
    } catch (err) {
      showErrorAlert("ผิดพลาด", err.message);
    }
  };

  if (!coupon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen bg-white text-black font-sans
         flex flex-col items-center
         px-4 pt-4
         pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0
         overflow-y-auto ${styles.fonts}`}
    >
      <div className="w-full max-w-md flex-1">
        <div className="mb-6">
          <Image
            src={coupon.image_url}
            alt={coupon.header}
            width={800}
            height={600}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{coupon.header}</h1>

        <section className="space-y-4 mb-6 text-base md:text-lg">
          <div>
            <h2 className="font-semibold">รายละเอียดโปรโมชั่น</h2>
            <p>{coupon.description}</p>
          </div>
          <div>
            <h2 className="font-semibold">เงื่อนไข</h2>
            <p>{coupon.term}</p>
          </div>
          <div>
            <h2 className="font-semibold">ระยะเวลาที่ใช้ได้</h2>
            <p>
              {new Date(coupon.valid_from).toLocaleDateString("th-TH")} ถึง{" "}
              {new Date(coupon.valid_until).toLocaleDateString("th-TH")}
            </p>
          </div>
        </section>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 bg-white z-50 shadow-t-md m-2 border border-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          onClick={handleClick}
          className="flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 25"
              width="24"
              height="24"
              className="fill-current"
            >
              <g fill="currentColor">
                <path
                  d="m1.24951 7.99925c0-2.62335 2.12665-4.75 4.75-4.75h11.99999c2.6234 0 4.75 2.12665 4.75 4.75v1.22305c0 .56557-.3943.9749-.8208 1.1219-.6872.237-1.1792.8895-1.1792 1.6551 0 .7655.492 1.418 1.1792 1.655.4265.147.8208.5563.8208 1.1219v1.2231c0 2.6233-2.1266 4.75-4.75 4.75h-11.99999c-2.62335 0-4.75-2.1267-4.75-4.75v-1.2231c0-.5656.39428-.9749.82079-1.1219.68724-.237 1.17921-.8895 1.17921-1.655 0-.7656-.49197-1.4181-1.17921-1.6551-.42651-.147-.82079-.55632-.82079-1.1219z"
                  opacity=".3"
                />
                <path d="m10.3576 10.3573c-.3092.3091-.81034.3091-1.11945 0s-.30911-.81026 0-1.11938c.30911-.30911.81025-.30911 1.11945 0 .3091.30912.3091.81028 0 1.11938z" />
                <path d="m14.7604 14.7602c-.3091.3091-.8103.3091-1.1194 0-.3091-.3092-.3091-.8103 0-1.1194.3091-.3092.8103-.3092 1.1194 0 .3091.3091.3091.8102 0 1.1194z" />
                <path d="m14.7685 9.22992c.2929.2929.2929.76777 0 1.06068l-4.4776 4.4776c-.29291.2929-.76778.2929-1.06068 0-.29289-.29289-.29289-.7678 0-1.0607l4.47758-4.47758c.2929-.29289.7678-.29289 1.0607 0z" />
              </g>
            </svg>
            <span>รับโค้ดส่วนลด</span>
          </div>
        </button>
      </div>
    </main>
  );
}
