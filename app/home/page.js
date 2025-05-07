// app/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeLiff } from "@/utils/liff";
import styles from "@/app/styles/styles.module.css";
import CouponCard from "@/app/component/couponCard";
import TicketFrame from "@/app/component/ticketFrame";
import QrCodeIcon from "../component/qrcodeicon";
import ClaimIcon from "../component/claimicon";
import LineIcon from "../component/lineicon";
import BottomBar from "../component/bottombar";
import { fetchUserCoupons, fetchCoupons } from "@/utils/couponService";
import FireIcon from "../component/fireicon";

// แสดงกล่องเปล่าเมื่อไม่มีข้อมูล
function CouponFlex({ coupon }) {
  if (!coupon || !coupon.id) {
    return <div className="flex-none w-[100px] h-[120px] text-center"></div>;
  }
  return (
    <div
      className="
        flex-none w-[100px] h-[120px] bg-blue-100 border border-green-300 rounded-xl p-4 flex flex-col items-center justify-center
      "
    >
      {/* ถ้ามีรูป ก็ปรับให้พอดีกรอบ */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="50"
        height="50"
        className="fill-current"
      >
        <g fill="blue">
          <path
            d="m1.24951 7.99925c0-2.62335 2.12665-4.75 4.75-4.75h11.99999c2.6234 0 4.75 2.12665 4.75 4.75v1.22305c0 .56557-.3943.9749-.8208 1.1219-.6872.237-1.1792.8895-1.1792 1.6551 0 .7655.492 1.418 1.1792 1.655.4265.147.8208.5563.8208 1.1219v1.2231c0 2.6233-2.1266 4.75-4.75 4.75h-11.99999c-2.62335 0-4.75-2.1267-4.75-4.75v-1.2231c0-.5656.39428-.9749.82079-1.1219.68724-.237 1.17921-.8895 1.17921-1.655 0-.7656-.49197-1.4181-1.17921-1.6551-.42651-.147-.82079-.55632-.82079-1.1219z"
            opacity=".5"
          />
          <path d="m10.3576 10.3573c-.3092.3091-.81034.3091-1.11945 0s-.30911-.81026 0-1.11938c.30911-.30911.81025-.30911 1.11945 0 .3091.30912.3091.81028 0 1.11938z" />
          <path d="m14.7604 14.7602c-.3091.3091-.8103.3091-1.1194 0-.3091-.3092-.3091-.8103 0-1.1194.3091-.3092.8103-.3092 1.1194 0 .3091.3091.3091.8102 0 1.1194z" />
          <path d="m14.7685 9.22992c.2929.2929.2929.76777 0 1.06068l-4.4776 4.4776c-.29291.2929-.76778.2929-1.06068 0-.29289-.29289-.29289-.7678 0-1.0607l4.47758-4.47758c.2929-.29289.7678-.29289 1.0607 0z" />
        </g>
      </svg>

      {/* หัวข้อ 1 บรรทัด ไม่ให้ล้น */}
      <h4 className="text-[10px] font-bold truncate w-full">{coupon.header}</h4>

      {/* รายละเอียด 1 บรรทัด */}
      <p className="text-[8px] text-gray-600 truncate w-full">
        {coupon.description}
      </p>

      {/* วันหมดอายุ ด้านล่างสุด */}
      <p className="text-[7px] text-gray-500 truncate w-full mt-auto">
        หมดอายุ {new Date(coupon.valid_until).toLocaleDateString("th-TH")}
      </p>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userCoupons, setUserCoupons] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // carousel states
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [ticketIndex, setTicketIndex] = useState(0);
  const [withTransitionTickets, setWithTransitionTickets] = useState(true);

  // user
  const [userProfile, setProfile] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    phone: "",
    email: "",
  });
  // dimensions
  const CARD_WIDTH = 100;
  const TICKET_CARD_WIDTH = 160;
  const GAP = 7;
  const VISIBLE_COUNT = 2;
  const INTERVAL = 5000;
  const DURATION = 700;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadAll() {
      try {
        // init LIFF
        const liff = await initializeLiff();
        if (!liff.isLoggedIn()) {
          router.push("/login");
          return;
        }
        const profile = await liff.getProfile();
        setProfile(profile);
        const res = await fetch(`/api/users?id=${profile.userId}`);
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
        // fetch user coupons
        const uc = await fetchUserCoupons(profile.userId);
        setUserCoupons(uc);

        // fetch available coupons
        const c = await fetchCoupons();
        setCoupons(c);
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [router]);

  // user coupons carousel
  useEffect(() => {
    if (userCoupons.length <= 1) return;
    const max = userCoupons.length;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= max) {
          setTimeout(() => {
            setWithTransition(false);
            setIndex(0);
          }, DURATION);
          return next;
        }
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [userCoupons]);

  useEffect(() => {
    if (!withTransition) {
      requestAnimationFrame(() => setWithTransition(true));
    }
  }, [withTransition]);

  // coupons carousel
  useEffect(() => {
    if (coupons.length <= 1) return;
    const max = coupons.length;
    const id = setInterval(() => {
      setTicketIndex((i) => {
        const next = i + 1;
        if (next >= max) {
          setTimeout(() => {
            setWithTransitionTickets(false);
            setTicketIndex(0);
          }, DURATION);
          return next;
        }
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, [coupons]);

  useEffect(() => {
    if (!withTransitionTickets) {
      requestAnimationFrame(() => setWithTransitionTickets(true));
    }
  }, [withTransitionTickets]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

  const displayUser =
    userCoupons.length > 1
      ? [...userCoupons, ...userCoupons]
      : [...userCoupons];
  // ถ้ามีมากกว่า 1 ค่อย duplicate
  const displayCoupons =
    coupons.length > 1 ? [...coupons, ...coupons] : [...coupons];

  // ความกว้าง wrapper: ถ้า >1 ให้ใช้ VISIBLE_COUNT ช่อง + gap, ถ้า =1 ก็แค่ CARD_WIDTH
  const wrapperWidth =
    userCoupons.length > 1
      ? VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP
      : CARD_WIDTH;
  // ถ้ามี >1 ค่อยเลื่อน
  const translateX = userCoupons.length > 1 ? index * (CARD_WIDTH + GAP) : 0;

  // สำหรับ tickets ก็เหมือนกัน
  const ticketWrapperWidth =
    coupons.length > 1
      ? VISIBLE_COUNT * TICKET_CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP
      : TICKET_CARD_WIDTH;
  const translateTicket =
    coupons.length > 1 ? ticketIndex * (TICKET_CARD_WIDTH + GAP) : 0;

  return (
    <div
      className={`min-h-screen m-auto bg-white py-4 px-4 max-w-md mx-auto relative text-black ${styles.container} ${styles.fonts}`}
    >
      {userProfile && (
        <div
          className={`cursor-pointer ${styles.profileBox}`}
          onClick={() => router.push("/my-profile")}
        >
          <img
            src={userProfile.pictureUrl}
            alt="Profile"
            className={styles.profileImage}
          />
          <div>
            <div className={styles.profileText}>Line Account</div>
            <div className={styles.profileSubtext}>
              คุณ {userData.first_name || userProfile?.displayName}
            </div>
          </div>
        </div>
      )}
      <div className="w-full mb-4 h-[128px] bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer">
        Wait for image
      </div>

      <div className="m-2">
        <p className="text-[20px] font-bold">
          คุณ {userData.first_name || userProfile?.displayName}
        </p>
        <p className="text-[10px]">ยินดีต้อนรับ Advice Line Official Account</p>
      </div>
      <div className="w-full gap-1 rounded-xl flex items-center justify-center">
        {/* กล่อง Line */}
        <div
          className="flex-none w-[160px] h-[70px] bg-green-100 border border-green-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer"
          onClick={() => router.push(`/`)}
        >
          <div className="flex items-center">
            {/* ขยายไอคอนด้วย scale-150 */}
            <div className="inline-block origin-center scale-150">
              <LineIcon />
            </div>
            <div className="ml-2 font-light mt-1 text-[11px] text-gray-800">
              <p className=" font-[1000] ">Line Official</p>
              <p>หาสาขาใกล้คุณ</p>
            </div>
          </div>
        </div>

        {/* กล่องเคลม */}
        <div
          className="flex-none w-[160px] h-[70px] bg-sky-100 border border-sky-500 rounded-xl p-4 flex items-center justify-center cursor-pointer"
          onClick={() => router.push(`/`)}
        >
          <div className="flex items-center">
            {/* ห่อ SVG ด้วย container ที่ขยาย */}
            <div className="inline-block origin-center scale-350">
              <ClaimIcon />
            </div>

            <div className="ml-2 font-light text-[11px] text-gray-800">
              <p>การตรวจสอบสถานะ</p>
              <p>การเคลมสินค้า</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-2 py-6">
        {/* คูปองส่วนลดของคุณ */}
        <div className="flex item-center">
          <QrCodeIcon />
          <h3 className="text-[17px] font-semibold mb-4">คูปองส่วนลดของคุณ</h3>
        </div>
        <div className="flex items-start justify-center gap-2 mb-4">
          {/* 1) สไลด์ของคูปอง */}
          <div className="flex items-start gap-2">
            {/* สไลด์ของคูปอง */}
            <div className="overflow-hidden" style={{ width: wrapperWidth }}>
              <div
                className={`flex ${
                  displayUser.length > 1 && withTransition
                    ? "transition-transform duration-700 ease-in-out"
                    : ""
                }`}
                style={{
                  gap: `${GAP}px`,
                  transform:
                    displayUser.length > 1
                      ? `translateX(-${translateX}px)`
                      : "none",
                }}
              >
                {displayUser.map((c, idx) => (
                  <div
                    key={`${c.id}-${idx}`}
                    className="flex-none w-[100px] h-[120px] cursor-pointer"
                    onClick={() =>
                      router.push(`/my-coupons?couponId=${c.code}`)
                    }
                  >
                    <CouponFlex coupon={c} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => router.push(`/my-coupons`)}>
            <div
              className="flex-none w-[100px] h-[120px] bg-red-100 border border-red-700 rounded-xl p-4 flex flex-col items-center justify-center"
              style={{ cursor: "pointer" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="50"
                height="50"
                className="fill-current"
              >
                <g fill="green">
                  <path
                    d="m1.24951 7.99925c0-2.62335 2.12665-4.75 4.75-4.75h11.99999c2.6234 0 4.75 2.12665 4.75 4.75v1.22305c0 .56557-.3943.9749-.8208 1.1219-.6872.237-1.1792.8895-1.1792 1.6551 0 .7655.492 1.418 1.1792 1.655.4265.147.8208.5563.8208 1.1219v1.2231c0 2.6233-2.1266 4.75-4.75 4.75h-11.99999c-2.62335 0-4.75-2.1267-4.75-4.75v-1.2231c0-.5656.39428-.9749.82079-1.1219.68724-.237 1.17921-.8895 1.17921-1.655 0-.7656-.49197-1.4181-1.17921-1.6551-.42651-.147-.82079-.55632-.82079-1.1219z"
                    opacity=".3"
                  />
                  <path d="m10.3576 10.3573c-.3092.3091-.81034.3091-1.11945 0s-.30911-.81026 0-1.11938c.30911-.30911.81025-.30911 1.11945 0 .3091.30912.3091.81028 0 1.11938z" />
                  <path d="m14.7604 14.7602c-.3091.3091-.8103.3091-1.1194 0-.3091-.3092-.3091-.8103 0-1.1194.3091-.3092.8103-.3092 1.1194 0 .3091.3091.3091.8102 0 1.1194z" />
                  <path d="m14.7685 9.22992c.2929.2929.2929.76777 0 1.06068l-4.4776 4.4776c-.29291.2929-.76778.2929-1.06068 0-.29289-.29289-.29289-.7678 0-1.0607l4.47758-4.47758c.2929-.29289.7678-.29289 1.0607 0z" />
                </g>
              </svg>
              <p className="text-center text-[11px] font-bold text-gray-800 ">
                คูปองของคุณ
              </p>
              <p className="text-center text-[9px] text-gray-500">
                ดูคูปองส่วนลด
              </p>
            </div>
          </button>
        </div>

        {/* เก็บโค้ดส่วนลด */}
        <div className="flex items-center justify-between mb-4 mt-6">
          <div className="flex items-center">
            <FireIcon />
            <h3 className="text-[17px] font-semibold">เก็บโค้ดส่วนลด</h3>
          </div>
          <button
            onClick={() => router.push("/coupon")}
            className="ml-auto font-bold text-blue-800 cursor-pointer text-[12px]"
          >
            ดูทั้งหมด..?
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <div
            className="overflow-hidden rounded-xl items-center justify-center scale-100 origin-top-left"
            style={{ width: ticketWrapperWidth }}
          >
            <div
              className={`flex ${
                displayCoupons.length > 1 && withTransitionTickets
                  ? "transition-transform duration-700 ease-in-out"
                  : ""
              }`}
              style={{
                gap: `${GAP}px`,
                transform:
                  displayCoupons.length > 1
                    ? `translateX(-${translateTicket}px)`
                    : "none",
              }}
            >
              {displayCoupons.map((t, idx) => (
                <div
                  key={`${t.id}-${idx}`}
                  className="flex-none w-[160px] cursor-pointer"
                  onClick={() => router.push(`/coupon/detail/${t.code}`)}
                >
                  <TicketFrame>
                    <CouponCard coupon={t} />
                  </TicketFrame>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
