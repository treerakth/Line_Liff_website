'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { initializeLiff } from '@/utils/liff'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function initialize() {
      try {
        const liff = await initializeLiff()

        // Check if user is logged in
        if (!liff.isLoggedIn()) {
          router.push('/login')
          return
        }

        // Check friendship status
        const friendship = await liff.getFriendship()
        if (!friendship.friendFlag) {
          window.location.href = 'https://line.me/R/ti/p/@361gxcxl'
          return
        }

        // Get user profile
        const userProfile = await liff.getProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error('Error initializing LIFF:', error)
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center">
            <img
              src={profile.pictureUrl}
              alt={profile.displayName}
              className="h-24 w-24 rounded-full"
            />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-gray-900">
              {profile.displayName}
            </h2>
            <p className="mt-2 text-gray-600">User ID: {profile.userId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}