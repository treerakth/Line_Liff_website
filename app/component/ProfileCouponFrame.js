// File: app/components/ProfileCouponFrame.js
"use client";
import React from "react";
import clsx from "clsx";

export default function ProfileCouponFrame({ children, className }) {
  return (
    <div
      className={clsx(
        // กรอบตามอัตราส่วน 3/1.5
        "relative max-w-xs mx-auto mb-4 aspect-[3/1.5]",
        className
      )}
    >
      {/* SVG Background พร้อมเงาตามรูปร่าง (drop-shadow) */}
      <svg
        viewBox="0 0 300 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        // ใช้ Tailwind drop-shadow ให้เงาตามรูปร่าง SVG drop-shadow-lg
        className="absolute inset-0 w-full h-full z-0 filter "
      >
        <rect
          x="0.5"
          y="0.5"
          width="299"
          height="119"
          rx="8"
          fill="#C4E6FF"
          stroke="none"
        />
        <circle cx="0" cy="60" r="12" fill="#fff" />
        <circle cx="300" cy="60" r="12" fill="#fff" />
        <line
          x1="120"
          y1="8"
          x2="120"
          y2="112"
          stroke="#fff"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
      </svg>

      {/* Content wrapper */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
