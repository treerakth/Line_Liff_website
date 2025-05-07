"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeLiff } from "@/utils/liff";
import { fetchUserCoupons } from "@/utils/couponService";
import styles from "@/app/styles/styles.module.css";
import BottomBar from "@/app/component/bottombar";
import MyCouponCard from "@/app/component/MyCouponCard";
import CouponiconSize from "../component/couponiconsize";

export default function MyCouponsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCoupons, setUserCoupons] = useState([]);
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
          className={styles.profileBox}
          style={{ cursor: "pointer" }}
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
        <div
          className="w-full mb-4 h-[128px] bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer"
          style={{ cursor: "pointer" }}
        >
          Wait for image
        </div>
        <div className="">
          <p className="text-[20px] font-bold">คุณ :</p>
          <p className="text-[13px] font-light">
            ยินดีต้อนรับ Advice Line Official Account
          </p>
        </div>
        <div className="flex item-center m-1 mb-2">
          <CouponiconSize />
          <h2 className="text-[17px] font-semibold ml-1">คูปองของคุณ</h2>
        </div>

        {userCoupons.length === 0 ? (
          <p className="text-gray-700">ยังไม่มีคูปองที่เก็บไว้</p>
        ) : (
          <div className="flex flex-col">
            {userCoupons.map((coupon) => (
              <div
                key={coupon.code}
                className=" mb-2"
                onClick={() => router.push(`/my-coupons/${coupon.code}`)}
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
      </main>
      <BottomBar />
    </div>
  );
}
