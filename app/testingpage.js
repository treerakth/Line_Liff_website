

'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializeLiff } from '@/utils/liff'
import styles from '@/app/styles/styles.module.css'

function CouponCard({ coupon }) {
    return (
        <div className="flex-none w-[100px] h-[100px] bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
            <img className="w-5 h-5 mb-2" src={coupon.imageUrl} alt={coupon.title} />
            <h4 className="text-sm font-medium text-gray-800 text-center">{coupon.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{coupon.expiry}</p>
        </div>
    )
}

export default function Page() {
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [coupons, setCoupons] = useState([])
    const [index, setIndex] = useState(0)

    const CARD_WIDTH = 100
    const GAP = 6 // ปรับระยะห่างให้ดูสวยขึ้น

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        async function initLiffData() {
            try {
                const liff = await initializeLiff()
                if (!liff.isLoggedIn()) {
                    router.push('/login')
                    return
                }
                const data = await liff.getProfile()
                setProfile(data)
            } catch (e) {
                console.error('LIFF error:', e)
            } finally {
                setLoading(false)
            }
        }
        initLiffData()
    }, [router])

    useEffect(() => {
        const fakeCoupons = [
            { id: 1, imageUrl: '/test.png', title: 'ส่วนลด 10%', expiry: 'หมดอายุ 30 เม.ย.' },
            { id: 2, imageUrl: '/test.png', title: 'ส่งฟรี', expiry: 'หมดอายุ 15 พ.ค.' },
            { id: 3, imageUrl: '/test.png', title: 'ลด 100 บาท', expiry: 'หมดอายุ 1 พ.ค.' },
            { id: 4, imageUrl: '/test.png', title: 'พิเศษลูกค้าใหม่', expiry: 'หมดอายุ 20 เม.ย.' },
            { id: 5, imageUrl: '/test.png', title: 'ลด 20%', expiry: 'หมดอายุ 10 พ.ค.' },
            { id: 6, imageUrl: '/test.png', title: 'ซื้อ 1 แถม 1', expiry: 'หมดอายุ 5 พ.ค.' },
        ]
        setCoupons(fakeCoupons)
    }, [])

    useEffect(() => {
        const visibleCount = 2
        if (coupons.length > visibleCount) {
            const intervalId = setInterval(() => {
                setIndex(i => (i + 1) % coupons.length)
            }, 3000)
            return () => clearInterval(intervalId)
        }
    }, [coupons])

    if (!mounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-blue-500" />
            </div>
        )
    }

    const visibleCount = 2
    const wrapperWidth = visibleCount * CARD_WIDTH + (visibleCount - 1) * GAP

    return (
        <div className={`min-h-screen bg-gray-100 py-4 px-4 text-black ${styles.fonts} ${styles.container}`}>
            {profile && (
                <div className={styles.profileBox} onClick={() => router.push('/my-profile')}>
                    <img src={profile.pictureUrl} alt="Profile" className={styles.profileImage} />
                    <div>
                        <div className={styles.profileText}>Line Account</div>
                        <div className={styles.profileSubtext}>คุณ: {profile.displayName}</div>
                    </div>
                </div>
            )}

            <div className="max-w-md mx-auto px-4 py-6">
                <h3 className="text-lg font-semibold mb-4">คูปองส่วนลดของคุณ</h3>
                <div className="flex items-start gap-3">
                    <div className="overflow-hidden" style={{ width: wrapperWidth }}>
                        <div
                            className="flex gap-1.25 transition-transform duration-700 ease-in-out"
                            style={{
                                transform: `translateX(-${(index % coupons.length) * (CARD_WIDTH + GAP)}px)`,
                                width: `${coupons.length * (CARD_WIDTH + GAP)}px`,
                            }}
                        >
                            {coupons.map(c => (
                                <CouponCard key={c.id} coupon={c} />
                            ))}
                            {/* เพิ่มซ้ำอีก 2 ใบแรกเพื่อให้เลื่อนวนได้ลื่นขึ้น */}
                            {coupons.slice(0, 2).map(c => (
                                <CouponCard key={`loop-${c.id}`} coupon={c} />
                            ))}
                        </div>
                    </div>

                    <div className="flex-none">
                        <CouponCard coupon={{ imageUrl: '/test.png', title: 'Test', expiry: '-' }} />
                    </div>
                </div>
            </div>