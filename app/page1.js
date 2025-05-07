"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeLiff } from "@/utils/liff";
import styles from "@/app/styles/styles.module.css";
import CouponCard from "@/app/component/couponCard";
import TicketFrame from "@/app/component/ticketFrame";
import Fire from "./component/fireicon";
import BottomBar from "./component/bottombar";

// Mock data for coupons
const CouponMock = [
  { id: 1, title: "คูปองที่ 1", expiry: "2025-12-01" },
  { id: 2, title: "คูปองที่ 2", expiry: "2025-12-02" },
  { id: 3, title: "คูปองที่ 3", expiry: "2025-12-03" },
  { id: 4, title: "คูปองที่ 4", expiry: "2025-12-04" },
  { id: 5, title: "คูปองที่ 5", expiry: "2025-12-05" },
  { id: 6, title: "คูปองที่ 6", expiry: "2025-12-06" },
  { id: 7, title: "คูปองที่ 7", expiry: "2025-12-07" },
  { id: 8, title: "คูปองที่ 8", expiry: "2025-12-08" },
  { id: 9, title: "คูปองที่ 9", expiry: "2025-12-09" },
  { id: 10, title: "คูปองที่ 10", expiry: "2025-12-10" },
  { id: 11, title: "คูปองที่ 11", expiry: "2025-12-11" },
];

// Mock data for tickets

const tickets = [
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

// แสดงกล่องเปล่าเมื่อ coupon.id = null
function CouponFlex({ coupon }) {
  if (!coupon.id) {
    return <div className="flex-none w-[100px] h-[120px]" />;
  }
  return (
    <div className="flex-none w-[100px] h-[120px] bg-blue-100 border border-green-300 rounded-xl p-4 flex flex-col items-center justify-center">
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
      <h4 className="text-center text-[11px] font-bold text-gray-800 ">
        {coupon.title}
      </h4>
      <p className="text-center text-[9px] text-gray-500">{coupon.expiry}</p>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);

  // carousel states
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [ticketIndex, setTicketIndex] = useState(0);
  const [withTransitionTickets, setWithTransitionTickets] = useState(true);
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
    setCoupons(CouponMock);
  }, []);

  // prepare extended arrays
  const extended = [...coupons, ...coupons];
  const extendedTickets = [...tickets, ...tickets];

  // coupon loop
  useEffect(() => {
    if (coupons.length <= 1) return;
    const maxStart = coupons.length;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = i + 1;
        if (next >= maxStart) {
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
  }, [coupons]);
  useEffect(() => {
    if (!withTransition) requestAnimationFrame(() => setWithTransition(true));
  }, [withTransition]);

  // ticket loop
  useEffect(() => {
    if (tickets.length <= 1) return;
    const maxStart = tickets.length;
    const id = setInterval(() => {
      setTicketIndex((i) => {
        const next = i + 1;
        if (next >= maxStart) {
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
  }, [tickets]);
  useEffect(() => {
    if (!withTransitionTickets)
      requestAnimationFrame(() => setWithTransitionTickets(true));
  }, [withTransitionTickets]);

  if (!mounted || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );

  // calculate mask widths & translate
  const wrapperWidth = VISIBLE_COUNT * CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP;
  const translateX = index * (CARD_WIDTH + GAP);

  const ticketWrapperWidth =
    VISIBLE_COUNT * TICKET_CARD_WIDTH + (VISIBLE_COUNT - 1) * GAP;
  const translateTicket = ticketIndex * (TICKET_CARD_WIDTH + GAP);

  return (
    <div
      className={`min-h-screen bg-white py-4 px-4 relative text-black ${styles.fonts} ${styles.container}`}
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

      <div className="max-w-md mx-auto px-2 py-6">
        {/* coupons carousel */}
        <h3 className="text-lg font-semibold mb-4">คูปองส่วนลดของคุณ</h3>
        <div className="flex items-start gap-2">
          {/* กล่องที่เลื่อนได้ */}
          <div className="overflow-hidden" style={{ width: wrapperWidth }}>
            <div
              className={
                "cursor-pointer " +
                "flex " +
                (withTransition
                  ? "transition-transform duration-700 ease-in-out"
                  : "")
              }
              style={{
                gap: `${GAP}px`,
                transform: `translateX(-${translateX}px)`,
              }}
            >
              {extended.map((c, idx) => (
                <CouponFlex key={`${c.id}-${idx}`} coupon={c} />
              ))}
            </div>
          </div>

          {/* กล่องคงที่ */}
          <button onClick={() => router.push("/my-coupons")}>
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

        {/* tickets carousel */}
        <div className="flex items-center justify-between mb-4 mt-6">
          <div className="flex items-center">
            <Fire></Fire>
            <h3 className="text-lg font-semibold">เก็บโค้ดส่วนลด</h3>
          </div>
          <button
            onClick={() => router.push("/coupon")}
            className="text-green-600 flex items-center text-sm"
            style={{ cursor: "pointer" }}
          >
            <span className="font-bold text-blue-800">ดูทั้งหมด...?</span>
          </button>
        </div>
        <div
          className="overflow-hidden rounded-xl"
          style={{ width: ticketWrapperWidth }}
        >
          <div
            className={
              withTransitionTickets
                ? "flex transition-transform duration-700 ease-in-out"
                : "flex"
            }
            style={{
              gap: `${GAP}px`,
              transform: `translateX(-${translateTicket}px)`,
            }}
          >
            {extendedTickets.map((t, idx) => (
              <div
                key={`${t.head}-${idx}`}
                className="flex-none w-[160px]"
                style={{ cursor: "pointer" }}
                onClick={() => router.push(t.path)}
              >
                <TicketFrame>
                  <CouponCard coupon={t} />
                </TicketFrame>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomBar></BottomBar>
    </div>
  );
}
