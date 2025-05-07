// File: app/components/ProfileCouponCard.js
"use client";
import React, { useEffect, useState } from "react";
import ProfileCouponFrame from "./ProfileCouponFrame";
import liff from "@line/liff";
import styles from "@/app/styles/styles.module.css";
// นำเข้า SweetAlert2 helper
import { showSuccessCopy, showErrorCopy } from "@/utils/alert";

export default function ProfileCouponCard({ coupon }) {
  const [pictureUrl, setPictureUrl] = useState(null);

  useEffect(() => {
    if (liff.isLoggedIn()) {
      liff
        .getProfile()
        .then((profile) => setPictureUrl(profile.pictureUrl))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  const copyCode = () => {
    navigator.clipboard
      .writeText(coupon.code)
      .then(() => {
        showSuccessCopy("คัดลอกสำเร็จ", "โค้ดถูกคัดลอกไปยังคลิปบอร์ด");
      })
      .catch(() => {
        showErrorCopy("เกิดข้อผิดพลาด", "ไม่สามารถคัดลอกโค้ดได้");
      });
  };

  return (
    <ProfileCouponFrame>
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Top section: image and text split by SVG dashed line */}
        <div className="flex h-full">
          {/* Left: Profile image in left segment */}
          <div className="w-[120px] flex items-center justify-center">
            {pictureUrl ? (
              <img
                src={pictureUrl}
                alt="Profile"
                className="w-20 h-20 rounded-lg border-2 border-white object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
            )}
          </div>

          {/* Right: Coupon details */}
          <div className="flex-1 px-3 py-2 text-white overflow-hidden">
            <p
              className={`${styles.couponHeader} truncate text-lg font-semibold`}
              title={coupon.header}
            >
              {coupon.header}
            </p>
            <p
              className="text-sm mt-1 truncate font-bold text-red-700"
              title={`Valid until: ${new Date(
                coupon.valid_until
              ).toLocaleDateString("th-TH")}`}
            >
              หมดอายุ :{" "}
              {new Date(coupon.valid_until).toLocaleDateString("th-TH")}
            </p>
          </div>
        </div>

        {/* Bottom section: Code display and copy button */}
        <div className="flex items-center bg-white rounded-full overflow-hidden mx-2 mb-2">
          <span
            className="flex-1 text-center text-black px-4 py-2 truncate"
            title={coupon.code}
          >
            {coupon.code}
          </span>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
          >
            คัดลอก
          </button>
        </div>
      </div>
    </ProfileCouponFrame>
  );
}
