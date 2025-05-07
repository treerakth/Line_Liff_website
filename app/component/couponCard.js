// components/CouponCard.js
"use client";

import React from "react";
import Image from "next/image";
import TicketFrame from "./ticketFrame";
import styles from "@/app/styles/styles.module.css";

export default function CouponCard({ coupon }) {
  const expire_date = new Date(coupon.valid_until).toLocaleDateString("th-TH");
  return (
    <TicketFrame>
      <div className="flex flex-col h-full">
        {/* ภาพขนาด 1/3 สูงของ card */}
        <div className="relative w-full h-1/2 mb-1 bg-gray-100 scale-99">
          <Image
            src={coupon.image_url}
            alt={coupon.header}
            fill
            className="object-cover rounded-t-xl"
            stroke="#ccc"
            strokeWidth="2"
          />
        </div>

        {/* หัวเรื่อง */}
        <h3 className={styles.couponHead}>{coupon.header}</h3>

        {/* รายละเอียด */}
        <div className="flex-1 flex flex-col justify-center text-center">
          <p className={styles.couponDescription}>{coupon.description}</p>
          <p className={styles.couponTerm}>{coupon.term}</p>
        </div>

        {/* วันหมดอายุ */}
        <p className={styles.couponExpireDate}>วันหมดอายุ: {expire_date}</p>
      </div>
    </TicketFrame>
  );
}
