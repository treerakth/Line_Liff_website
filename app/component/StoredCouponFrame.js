"use client";
import React from "react";
import clsx from "clsx";

export default function StoredCouponFrame({ children, className }) {
  return (
    <div>
      <div
        className={clsx(
          "relative max-w-xs mx-auto mb-4 aspect-[3/1.2]",
          className
        )}
      >
        {/* SVG เป็น background */}
        <svg
          viewBox="0 0 300 120"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full z-0"
        >
          <rect
            x="0.5"
            y="0.5"
            width="299"
            height="119"
            rx="8"
            fill="#C4E6FF"
            stroke="ืnone"
            strokeWidth="1"
          />
          <circle cx="0" cy="60" r="12" fill="#fff" stroke="none" />
          <circle cx="300" cy="60" r="12" fill="#fff" stroke="none" />
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
        {/* เนื้อหาด้านใน */}
        <div className="absolute inset-0 z-10">{children}</div>
      </div>
    </div>
  );
}
