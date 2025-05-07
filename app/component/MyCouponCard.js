"use client";
import React from "react";
import StoredCouponFrame from "./StoredCouponFrame";
import styles from "@/app/styles/styles.module.css";
import MyCouponIcon from "./mycouponicon";
export default function MyCouponCard({ coupon }) {
  return (
    <StoredCouponFrame className="cursor-pointer">
      <div className="flex h-full">
        {/* ซ้าย: รูป */}
        <div className="flex-none w-1/4 flex flex-col items-center justify-center ml-7">
          <MyCouponIcon />
          <span className={styles.couponButton}>คลิก ใช้คูปอง</span>
        </div>
        {/* ขวา: ข้อมูล */}
        <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden text-center pl-7">
          <p className={`${styles.couponHeader} truncate`}>{coupon.head}</p>
          <div className="flex flex-col justify-center items-center text-sm">
            <p className={`${styles.mycouponCode}`}>{coupon.code}</p>
          </div>
          <p className={`${styles.mycouponExpireDate}`}>
            หมดอายุ {coupon.expire_date}
          </p>
        </div>
      </div>
    </StoredCouponFrame>
  );
}
