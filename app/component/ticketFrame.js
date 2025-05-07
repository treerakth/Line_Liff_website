// components/TicketFrame.js
"use client";

import React from "react";
import clsx from "clsx";

export default function TicketFrame({ children, className }) {
  return (
    <div
      className={clsx(
        "relative w-full max-w-xs mx-auto mb-8 aspect-[3/4]",
        className
      )}
    >
      {/* SVG เป็น background */}
      <svg
        viewBox="0 0 300 400"
        className="absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.5"
          y="0.5"
          width="299"
          height="399"
          rx="20"
          fill="#ffffffff"
          stroke="#ccc"
          strokeWidth="2"
        />
        <circle cx="0" cy="250" r="15" fill="#fff" stroke="#ccc" />
        <circle cx="300" cy="250" r="15" fill="#fff" stroke="#ccc" />
        <line
          x1="15"
          y1="250"
          x2="285"
          y2="250"
          stroke="#ccc"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>

      {/* เนื้อหาที่ส่งเข้ามา */}
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
}
