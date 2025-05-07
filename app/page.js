// app/page.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initializeLiff } from "@/utils/liff";
import styles from "@/app/styles/styles.module.css";
import LineIcon from "./component/lineicon";
import LineIconFlip from "./component/lineiconflip";
import CallIcon from "./component/callicon";
import BottomBar from "./component/bottombar";

export default function Page() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setProfile] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    phone: "",
    email: "",
  });
  const [nameOrCode, setNameOrCode] = useState("");
  const [province, setProvince] = useState("");
  const [postCode, setPostCode] = useState("");
  const [branches, setBranches] = useState([]);

  // โหลดตอน mount
  useEffect(() => {
    setMounted(true);
    fetchBranches();
  }, []);

  // useEffect(() => {
  // }, [nameOrCode, province, postCode]);
  const fetchBranches = async () => {
    const res = await fetch("/api/advice-branch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameOrCode,
        province,
        post_code: postCode,
      }),
    });
    const data = await res.json();
    setBranches(data.result || []);
  };

  useEffect(() => {
    async function loadAll() {
      try {
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
              last_name: u.last_name || "",
            });
          }
        }
        // ดึงข้อมูลสาขา (ครั้งแรกโหลดทั้งหมด ถ้าไม่ใส่ filter)
      } catch (e) {
        console.error("Error loading data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
      </div>
    );
  }

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
              คุณ{" "}
              {userData.first_name
                ? `${userData.first_name}`
                : userProfile?.displayName}
            </div>
          </div>
        </div>
      )}
      <div className="w-full mb-4 h-[128px] bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer">
        Wait for image
      </div>
      <div className="m-2">
        <p className="text-[20px] font-bold">
          คุณ{" "}
          {(userData.first_name && userData.last_name) || userData.first_name
            ? `${userData.first_name} ${userData.last_name}`
            : userProfile?.displayName}
        </p>
        <p className="text-[15px]">ยินดีต้อนรับ Advice Line Official Account</p>
      </div>
      {/* กล่อง filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="ชื่อสาขาแอดไวซ์ หรือ รหัสสาขา"
          value={nameOrCode}
          onChange={(e) => setNameOrCode(e.target.value)}
          className="text-[15px] w-full border border-gray-300 rounded p-2"
        />
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="สาขาจังหวัด"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="text-[15px] w-24 border border-gray-300 rounded p-2"
          />
          <input
            type="text"
            placeholder="รหัสไปรษณีย์"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            className="text-[15px] w-27 border border-gray-300 rounded p-2"
          />
          <button
            onClick={fetchBranches}
            className=" text-[15px] flex-1 px-4 py-2 bg-blue-600 text-white rounded"
            style={{ cursor: "pointer" }}
          >
            @ ค้นหาสาขา
          </button>
        </div>
      </div>
      <div className="flex mt-3">
        <LineIcon />
        <p className="text-[20px] font-bold">รายชื่อสาขาแอดไวซ์</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        {branches.map((branch, index) => (
          <section
            key={index}
            onClick={() => router.push(`${branch.line_link}`)}
            className="w-full"
          >
            <div
              className="
            w-full 
            h-[260px] 
            bg-white 
            border 
            border-green-400 
            rounded-xl 
            overflow-hidden
            flex 
            flex-col 
            items-center 
            justify-start
            "
              style={{ cursor: "pointer" }}
            >
              <img
                src={branch.pic || undefined}
                alt={branch.name}
                // rounded-t-xl
                className="w-full h-[120px] object-cover rounded-t-xl"
              />
              <div className="pl-3 pr-3 mt-3 text-left w-full overflow-hidden">
                <p className="text-[13px] font-bold break-words line-clamp-2">
                  📌{branch.cuscode} {branch.name}
                </p>
                <p className="mt-1 flex pr-2 items-center text-[9px]">
                  <span className="whitespace-nowrap mr-1">Line OA ID's :</span>
                  <span
                    className="font-bold text-green-700 truncate min-w-0"
                    title={branch.line_id} // ใส่ title เผื่อให้ดูเต็มเวลาวางเมาส์
                  >
                    {branch.line_id}
                  </span>
                </p>
                <p className="mt-1 pr-2 items-center text-[9px] line-clamp-1">
                  {branch.address}
                </p>
                <div className="flex px-2 py-2 gap-2">
                  <button className="gap-1 flex-1 h-8 bg-green-600 text-white rounded flex items-center justify-center text-[10px]">
                    <LineIconFlip />
                    แชทไลน์
                  </button>

                  <button className="w-10 h-8 bg-gray-400 text-white rounded flex items-center justify-center text-[10px]">
                    <CallIcon />
                  </button>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <BottomBar />
    </div>
  );
}
