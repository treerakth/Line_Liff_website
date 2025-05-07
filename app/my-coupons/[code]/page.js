// app/my-coupons/[code]/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { initializeLiff } from "@/utils/liff";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import ProfileCouponCard from "@/app/component/ProfileCouponCard";
import BottomBar from "@/app/component/bottombar";
import styles from "@/app/styles/styles.module.css";

export default function CouponDetailPage() {
  const { code } = useParams();
  const router = useRouter();
  const [profileUrl, setProfileUrl] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const barcodeRef = useRef(null);
  const [mode, setMode] = useState("qrcode");

  // 1. ดึงข้อมูล coupon จาก API
  useEffect(() => {
    if (!code) return;
    fetch(`/api/coupons?code=${code}`)
      .then((r) => {
        if (!r.ok) throw new Error("ไม่พบข้อมูลคูปอง");
        return r.json();
      })
      .then((data) => setCoupon(data))
      .catch(() => router.back());
  }, [code, router]);

  // 2. init LIFF + getProfile
  useEffect(() => {
    initializeLiff()
      .then((liff) => {
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        return liff.getProfile();
      })
      .then((profile) => {
        if (profile) setProfileUrl(profile.pictureUrl);
      })
      .catch(console.error);
  }, [router]);

  // 3. สร้าง QR หรือ Barcode หลังดึง coupon เสร็จ
  useEffect(() => {
    if (!coupon) return;
    if (mode === "qrcode") {
      QRCode.toDataURL(code, { width: 300, margin: 2 })
        .then(setQrUrl)
        .catch(() => setQrUrl(""));
    } else {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, code, {
          format: "CODE128",
          displayValue: false,
          height: 80,
          width: 2,
        });
        setQrUrl("");
      }
    }
  }, [coupon, mode, code]);

  if (!coupon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 pt-4 pb-24">
      <div className="mb-10"></div>
      <ProfileCouponCard coupon={coupon}>
        <div className="flex h-full">
          {/* ซ้าย: รูปโปรไฟล์ */}
          <div className="flex-none px-4 flex items-center justify-center">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile"
                className="w-16 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            )}
          </div>
          {/* เส้นแบ่ง */}
          <div className="w-px bg-white mx-4" />
          {/* ขวา: ข้อมูลคูปอง */}
          <div className="flex-1 flex flex-col justify-between text-white">
            <div>
              <p className="text-lg font-bold">{coupon.header}</p>
              <p className="text-2xl font-bold my-2">{coupon.header}</p>
              <p className="text-sm">
                เริ่มใช้{" "}
                {new Date(coupon.valid_from).toLocaleDateString("th-TH")}
              </p>
              <p className="text-sm">
                ถึง {new Date(coupon.valid_until).toLocaleDateString("th-TH")}{" "}
                {new Date(coupon.valid_until).toLocaleTimeString("th-TH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {/* ล่าง: กล่องโค้ด + ปุ่มคัดลอก */}
            <div className="mt-4 flex items-center bg-white rounded-full overflow-hidden">
              <span className="flex-1 px-4 text-black">{code}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert("คัดลอกโค้ดแล้ว!");
                }}
                className="px-4 py-2 bg-red-600 text-white"
              >
                คัดลอก
              </button>
            </div>
          </div>
        </div>
      </ProfileCouponCard>

      {/* QR / Barcode */}
      <div className="mt-6 text-center">
        <div className="flex justify-center">
          <button
            onClick={() => setMode("qrcode")}
            className={`px-10 py-2 rounded-t-xl ${
              mode === "qrcode"
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            QR CODE
          </button>
          <button
            onClick={() => setMode("barcode")}
            className={`px-10 py-2 rounded-t-xl ${
              mode === "barcode"
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            BARCODE
          </button>
        </div>
        <div className="mt-4 flex justify-center">
          {mode === "qrcode" && qrUrl && (
            <div className="border-1 border-gray-300 rounded-lg inline-block">
              <img src={qrUrl} alt={`QR for ${code}`} className="mx-auto" />
            </div>
          )}
          {mode === "barcode" && (
            <div className="border-1 border-gray-300 rounded-lg inline-block">
              <svg ref={barcodeRef} className="mx-auto" />
            </div>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
