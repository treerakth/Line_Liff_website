// app/utils/couponService.js
export async function fetchCoupons() {
    try {
        const res = await fetch('/api/coupons')
        if (!res.ok) throw new Error('Failed to fetch coupons')
        return res.json()
    } catch (error) {
        throw error
    }
}

export async function fetchUserCoupons(line_userid) {
    try {
        const res = await fetch(`/api/userCoupons?line_userid=${line_userid}`)
        if (!res.ok) throw new Error('Failed to fetch user coupons')
        return res.json()
    } catch (error) {
        throw error
    }
}

export async function collectCoupon({ line_userid, coupon_id }) {
    try {
        const res = await fetch('/api/userCoupons', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ line_userid, coupon_id })
        })
        if (!res.ok) {
            const errData = await res.json()
            throw new Error(errData.error || 'Failed to collect coupon')
        }
        return res.json()
    } catch (error) {
        throw error
    }
}
