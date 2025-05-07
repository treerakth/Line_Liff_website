// utils/registerUser.js

export const registerUser = async (profile) => {
    // เช็คว่า profile มีข้อมูลครบไหม
    if (!profile?.userId || !profile?.displayName || !profile?.pictureUrl) {
        throw new Error('Missing profile information')
    }

    try {
        // ส่งข้อมูลไปยัง API /api/users
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                line_userid: profile.userId,
                line_displayname: profile.displayName,
                line_pictureURL: profile.pictureUrl,
            }),
        })

        // เช็คว่า request สำเร็จไหม
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || 'Failed to register user')
        }

        // ถ้าสำเร็จจะได้รับข้อมูลที่ถูกบันทึกกลับมา
        const data = await res.json()
        return data
    } catch (err) {
        // ถ้าเกิด error จะแสดงข้อผิดพลาด
        throw new Error(err.message || 'Failed to register user')
    }
}
