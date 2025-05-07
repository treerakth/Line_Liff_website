'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializeLiff } from '@/utils/liff'
import styles from '@/app/styles/styles.module.css'
export default function Login() {
  const [countdown, setCountdown] = useState(10)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let timer;
    async function checkLogin() {
      try {
        const liff = await initializeLiff()
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true)
          timer = startCountdown()
        }
      } catch (error) {
        console.error('Error checking login status:', error)
      }
    }

    checkLogin()
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      router.push('/')
    }
  }, [countdown])

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return timer
  }

  const handleLogin = async () => {
    try {
      const liff = await initializeLiff()
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: "https://localhost:3000/login" })
      }
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  return (
    <div className={`${styles.fonts} min-h-screen flex items-center justify-center bg-gray-100`}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLoggedIn ? 'เข้าสู่ระบบสำเร็จ!' : 'ยินดีต้อนรับ'}
          </h2>
          {isLoggedIn ? (
            <p className="mt-4 text-lg text-gray-600">
              กรุณารอ {countdown} วินาที...
            </p>
          ) : (
            <p className="mt-4 text-lg text-gray-600">
              โปรดเข้าสู่ระบบด้วย Line Account
            </p>
          )}
        </div>

        {!isLoggedIn && (
          <div className="mt-8">
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}