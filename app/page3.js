// File: app/advice-branch/page.js
"use client";
import React, { useState, useEffect } from "react";

export default function AdviceBranchPage() {
  // ฟิลเตอร์ค้นหา
  const [nameOrCode, setNameOrCode] = useState("");
  const [province, setProvince] = useState("");
  const [postCode, setPostCode] = useState("");
  const [branches, setBranches] = useState([]);

  // ดึงข้อมูลสาขา (ครั้งแรกโหลดทั้งหมด ถ้าไม่ใส่ filter)
  const fetchBranches = async () => {
    const res = await fetch("/api/advice-branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameOrCode, province, post_code: postCode }),
    });
    const data = await res.json();
    setBranches(data.result || []);
  };

  // โหลดตอน mount
  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen bg-white py-4 px-4 w-full">
      {/* ฟิลเตอร์ */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="ชื่อสาขาแอดไวซ์ หรือ รหัสสาขา"
          value={nameOrCode}
          onChange={(e) => setNameOrCode(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="สาขาจังหวัด"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            placeholder="รหัสไปรษณีย์"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            onClick={fetchBranches}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            ค้นหา
          </button>
        </div>
      </div>

      {/* แสดงผลกรอบ 2 คอลัมน์ responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.cuscode}
            className="bg-red-100 border border-red-700 rounded-xl p-4 flex flex-col h-full"
          >
            {/* รูปแบบสาขา */}
            <p className="text-sm font-bold mb-1">{branch.format_adv}</p>
            {/* รหัสสาขา */}
            <p className="text-xs mb-1">รหัส: {branch.cuscode}</p>
            {/* ชื่อสาขา */}
            <p className="text-xs truncate mb-1" title={branch.name}>
              {branch.name}
            </p>
            {/* ที่อยู่ */}
            <p className="text-xs truncate mb-4" title={branch.address}>
              {branch.address}
            </p>
            {/* ปุ่มซ้าย & ขวา */}
            <div className="mt-auto flex justify-between">
              <button className="px-3 py-1 bg-green-500 text-white rounded">
                ซ้าย
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded">
                ขวา
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
