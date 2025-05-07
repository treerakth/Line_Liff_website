"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { initializeLiff } from "@/utils/liff";
import { fetchUserCoupons } from "@/utils/couponService";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import styles from "@/app/styles/styles.module.css";
import BottomBar from "@/app/component/bottombar";
import MyCouponCard from "@/app/component/MyCouponCard";
import CouponiconSize from "../component/couponiconsize";

export default function MyCouponsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCoupons, setUserCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [codeType, setCodeType] = useState("qrcode");
  const [codeUrl, setCodeUrl] = useState("");
  const barcodeRef = useRef(null);
  const router = useRouter();
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
        const coupons = await fetchUserCoupons(userProfile.userId);
        setUserCoupons(coupons);
        console.log(coupons);
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
    if (!selectedCoupon) return;
    if (codeType === "qrcode") {
      QRCode.toDataURL(selectedCoupon.code, { width: 300, margin: 2 })
        .then((url) => setCodeUrl(url))
        .catch(() => setCodeUrl(""));
    } else {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, selectedCoupon.code, {
          format: "CODE128",
          displayValue: false,
          height: 80,
          width: 2,
        });
        setCodeUrl("");
      }
    }
  }, [selectedCoupon, codeType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div
      className={`max-w-md mx-auto min-h-screen bg-white py-4 px-4 relative ${styles.fonts}`}
    >
      {profile && (
        <div
          className={`cursor-pointer ${styles.profileBox}`}
          onClick={() => router.push("/my-profile")}
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

      <main className="m-auto flex-1 p-4 pb-24">
        <div className="mb-4 m-auto flex-none w-[335px] h-[128px] bg-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer">
          Wait for image
        </div>
        <div className="">
          <p className="text-[20px] font-bold">คุณ :</p>
          <p className="text-[13px] font-light">
            ยินดีต้อนรับ Advice Line Official Account
          </p>
        </div>
        <div className="ml-10 flex item-center m-1 mb-2">
          <CouponiconSize />
          <h2 className="text-[17px] font-semibold ml-1">คูปองของคุณ</h2>
        </div>

        {userCoupons.length === 0 ? (
          <p className="text-gray-700">ยังไม่มีคูปองที่เก็บไว้</p>
        ) : (
          <div className="flex flex-col">
            {userCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className=" mb-2"
                onClick={() => {
                  setSelectedCoupon(coupon);
                  setCodeType("qrcode");
                }}
              >
                <MyCouponCard
                  coupon={{
                    head: coupon.header,
                    code: coupon.code,
                    expire_date: new Date(
                      coupon.valid_until
                    ).toLocaleDateString("th-TH"),
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Modal QR/Barcode */}
        {selectedCoupon && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
              <h2 className="text-xl font-bold mb-2">
                รหัสคูปอง:{" "}
                <span className="text-green-800">{selectedCoupon.code}</span>
              </h2>
              <ul className="mb-4">
                <li>{selectedCoupon.description}</li>
                <li>
                  หมดอายุวันที่{" "}
                  <span className="text-red-700">
                    {new Date(selectedCoupon.valid_until).toLocaleDateString(
                      "th-TH"
                    )}
                  </span>
                </li>
              </ul>

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setCodeType("qrcode")}
                  className={`px-4 py-1 rounded ${
                    codeType === "qrcode"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  QR CODE
                </button>
                <button
                  onClick={() => setCodeType("barcode")}
                  className={`px-4 py-1 rounded ${
                    codeType === "barcode"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  BARCODE
                </button>
              </div>

              {codeType === "qrcode" && codeUrl && (
                <div className="w-[300px] h-[300px] mx-auto mb-4">
                  <img src={codeUrl} alt="QR Code" />
                </div>
              )}
              {codeType === "barcode" && (
                <div className="w-[300px] h-[100px] mx-auto mb-4">
                  <svg ref={barcodeRef} />
                </div>
              )}

              <div className="text-right">
                <button
                  onClick={() => setSelectedCoupon(null)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomBar />
    </div>
  );
}
