"use client";
import React from "react";
import styles from "@/app/styles/styles.module.css";
import { useRouter } from "next/navigation";

export default function BottomBar() {
  const router = useRouter();
  return (
    <nav className={styles.bottomBar}>
      {/* โค้ดส่วนลด */}
      <button
        onClick={() => router.push("/my-coupons")}
        className={styles.menuButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          viewBox="0 0 21 20"
          fill="black"
        >
          <path d="m21 5h-1-2-12-2-1c-.553 0-1 .447-1 1v1 1.938 1.062h.893c.996 0 1.92.681 2.08 1.664.204 1.253-.758 2.336-1.973 2.336h-1v1.062 1.938 1c0 .553.447 1 1 1h1 2 12 2 1c.553 0 1-.447 1-1v-1-1.938-1.062s-.447 0-1 0c-1.215 0-2.177-1.083-1.973-2.336.16-.983 1.084-1.664 2.08-1.664h.893v-1.062-1.938-1c0-.553-.447-1-1-1zm-10 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2z" />
        </svg>
      </button>
      {/* เก็บโค้ด */}
      <button
        onClick={() => router.push("/coupon")}
        className={styles.menuButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          viewBox="0 0 23 23"
          fill="none"
        >
          <g
            xmlns="http://www.w3.org/2000/svg"
            stroke="#333"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="m11.5808 5.10265 9.7613 9.76125-7.4782 7.4782-9.76127-9.7613-.36363-7.84179z" />
            <path d="m7 8v.01" />
            <path d="m12 11 4.2427 4.2426m-6.2427-2.2426 4.2427 4.2426" />
          </g>
        </svg>
      </button>
      {/* หน้าแรก */}
      <button
        onClick={() => router.push("/home")}
        className={styles.menuButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-6 mx-auto"
          viewBox="0 0 28 30"
          fill="black"
        >
          <path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16 11.543l8.25 6.186z" />
        </svg>
      </button>
      {/* QR Account */}
      <button
        onClick={() => router.push("/add-friend")}
        className={styles.menuButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          viewBox="0 0 24 24"
          fill="black"
        >
          <path
            d="m4 4h6v6h-6zm16 0v6h-6v-6zm-6 11h2v-2h-2v-2h2v2h2v-2h2v2h-2v2h2v3h-2v2h-2v-2h-3v2h-2v-4h3zm2 0v3h2v-3zm-12 5v-6h6v6zm2-14v2h2v-2zm10 0v2h2v-2zm-10 10v2h2v-2zm-2-5h2v2h-2zm5 0h4v4h-2v-2h-2zm2-5h2v4h-2zm-9-4v4h-2v-4a2 2 0 0 1 2-2h4v2zm20-2a2 2 0 0 1 2 2v4h-2v-4h-4v-2zm-20 18v4h4v2h-4a2 2 0 0 1 -2-2v-4zm20 4v-4h2v4a2 2 0 0 1 -2 2h-4v-2z"
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {/* โปรไฟล์ */}
      <button
        onClick={() => router.push("/my-profile")}
        className={styles.menuButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mx-auto"
          viewBox="0 0 24 24"
          fill="black"
        >
          <path d="M12 12c2.28 0 4-1.72 4-4s-1.72-4-4-4-4 1.72-4 4 1.72 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </button>
    </nav>
  );
}
