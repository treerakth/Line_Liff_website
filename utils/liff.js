'use client'
import liff from '@line/liff'
const LIFF_ID = '2007222856-DZYKodxY'
export async function initializeLiff() {
  if (!liff.isInClient()) {
    if (!LIFF_ID) {
      throw new Error('LIFF ID is required')
    }
  }

  try {
    await liff.init({
      liffId: LIFF_ID
    })
    return liff
  } catch (error) {
    console.error('LIFF initialization failed:', error)
    throw error
  }
}
export const logout = () => {
  if (liff.isLoggedIn()) {
    liff.logout();
  }
}