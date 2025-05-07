import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function MyComponent() {
    const router = useRouter();
    const [liffState, setLiffState] = useState(null);

    useEffect(() => {
        // รอให้ router พร้อมก่อนใช้งาน
        if (!router.isReady) return;

        // วิธีที่ 1: ตรวจสอบโดยตรงจาก router.query
        const directValue = router.query['liff.state'];

        // วิธีที่ 2: หาก Next.js แปลง query ให้เป็นออบเจ็กต์ย่อย
        const nestedValue = router.query.liff && router.query.liff.state;

        setLiffState(directValue || nestedValue || null);
    }, [router]);

    return (
        <div>
            <h1>liff.state: {liffState}</h1>
        </div>
    );
}
