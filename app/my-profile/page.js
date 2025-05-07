"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeLiff } from "@/utils/liff";
import styles from "@/app/styles/styles.module.css";
import BottomBar from "../component/bottombar";

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
  return (
    <div className={`flex flex-col min-h-screen bg-white ${styles.fonts}`}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="max-w-md mx-auto px-4 py-6 space-y-6">
            {/* Profile Header */}
            <div className="mt-10 flex flex-col items-center">
              <img
                src={profile?.pictureUrl}
                alt={profile?.displayName}
                className="w-24 h-24 rounded-full border-2 border-gray-200 mb-5"
              />
              {/* border-2 border-gray-200 */}
              <h2 className="text-xl font-semibold">
                คุณ {userData.first_name || profile?.displayName}
              </h2>
              <p className="text-sm text-gray-600">
                User ID : {profile?.userId}
              </p>
            </div>

            {/* Account Details Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-800 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="m4 21v-4c0-1.1046.89543-2 2-2h12c1.1046 0 2 .8954 2 2v4" />
                  </g>
                </svg>
                <span className="font-medium">รายละเอียดบัญชี</span>
              </div>
              <button
                onClick={() => router.push("/my-profile/edit-profile")}
                className="text-green-600 flex items-center text-sm mb-4"
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <g transform="scale(0.5)">
                    <path d="m0 0h48v48h-48z" fill="#fff" fillOpacity={0.01} />
                    <g stroke="#000" strokeLinejoin="round" strokeWidth="2">
                      <path
                        d="m42 26v14c0 1.1046-.8954 2-2 2h-32c-1.10457 0-2-.8954-2-2v-32c0-1.10457.89543-2 2-2h14"
                        strokeLinecap="round"
                      />
                      <path
                        d="m14 26.7199v7.2801h7.3172l20.6828-20.6919-7.3049-7.3081z"
                        fill="currentColor"
                      />
                    </g>
                  </g>
                </svg>
                แก้ไข
              </button>
            </div>

            {/* Phone & Email Inputs (read-only) */}
            <div className="space-y-9">
              <div className="relative">
                <label
                  htmlFor="phone"
                  className="absolute -top-5 left-3 font-semibold bg-transparent px-1 text-sm text-gray-700"
                >
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="phone"
                  type="text"
                  value={userData.phone}
                  placeholder=""
                  readOnly
                  className="focus:outline-none focus:ring-2 focus:ring-green-400 cursor-not-allowed w-full bg-gray-100 text-gray-600 border border-gray-200 rounded-md px-3 py-2"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="email"
                  className="absolute -top-5 left-3 font-semibold bg-transparent px-1 text-sm text-gray-700"
                >
                  อีเมล
                </label>
                <input
                  id="email"
                  type="email"
                  value={userData.email}
                  placeholder=""
                  readOnly
                  className="focus:outline-none focus:ring-2 focus:ring-green-400 cursor-not-allowed w-full bg-gray-100 text-gray-600 border border-gray-200 rounded-md px-3 py-2"
                />
              </div>
            </div>
            {/* Customer Service Section */}
          </div>

          {/* Bottom Navigation Bar */}
          <BottomBar />
        </div>
      )}
    </div>
  );
}
