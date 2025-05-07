"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import styles from "@/app/styles/styles.module.css";
import { initializeLiff } from "@/utils/liff";
import BottomBar from "../component/bottombar";

export default function addFriendPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [codeType, setCodeType] = useState("qrcode");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const barcodeRef = useRef(null);

  // โหลดโปรไฟล์จาก LIFF
  useEffect(() => {
    async function getUser() {
      try {
        const liff = await initializeLiff();
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      } catch (err) {
        console.error("Error Initializing LIFF in MyProfile:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [router]);

  // สร้าง QR หรือ Barcode
  useEffect(() => {
    if (!profile) return;
    if (codeType === "qrcode") {
      QRCode.toDataURL(profile.userId, { width: 200, margin: 2 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => {
          console.error("Error generating QR code:", err);
          setQrDataUrl("");
        });
    } else if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, profile.userId, {
        format: "CODE128",
        displayValue: false,
        height: 80,
        width: 2,
      });
    }
  }, [profile, codeType]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div
      className={`max-w-md mx-auto flex flex-col min-h-screen bg-white px-4 pt-6 pb-[5rem]
    ${styles.fonts}`}
    >
      {/* Header / Profile */}
      <main className="bg-white flex flex-col items-center justify-start flex-1 max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <section className="flex flex-col items-center lg:items-start space-y-4">
          <img
            src={profile.pictureUrl}
            alt="User Picture from LINE"
            className="mx-auto w-32 h-32 rounded-full object-cover"
          />
          <div className="text-center lg:text-left">
            <p className="mt-4 text-center font-semibold text-black">
              คุณ : {profile.displayName}
            </p>
            <p className="text-sm text-gray-600">User ID : {profile.userId}</p>
          </div>
        </section>

        {/* QR/Barcode Section */}
        <section className="flex flex-col items-center space-y-4 w-full max-w-xs">
          <div className="flex gap-0">
            <button
              onClick={() => setCodeType("qrcode")}
              className={`px-4 py-2 rounded border ${
                codeType === "qrcode"
                  ? "bg-blue-600 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              QR Code
            </button>
            <button
              onClick={() => setCodeType("barcode")}
              className={`px-4 py-2 rounded border ${
                codeType === "qrcode"
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              Barcode
            </button>
          </div>
          {codeType === "qrcode" ? (
            qrDataUrl && (
              <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mt-2" />
            )
          ) : (
            <svg ref={barcodeRef} className="w-full h-20 mt-2" />
          )}
        </section>
      </main>
      {/* Bottom Navigation Bar */}
      <BottomBar />
    </div>
  );
}
