"use client";
import styles from "@/app/styles/styles.module.css";
import { useRouter } from "next/navigation";
import BottomBar from "../component/bottombar";
export default function MyItem() {
  const router = useRouter();
  const currentPath = router.pathname;
  return (
    <div
      className={`min-h-screen bg-gray-100 py-4 px-4 relative text-black ${styles.container} `}
    >
      Hello
      <div>This is my Item Page สวัสดี</div>
      <BottomBar />
    </div>
  );
}
