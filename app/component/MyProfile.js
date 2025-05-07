"use client";
import React from "react";
import styles from "@/app/styles/styles.module.css";
import { useRouter } from "next/navigation";

export default function MyProfile(profile) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState({
    first_name: "",
    phone: "",
    email: "",
  });
  return (
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
  );
}
