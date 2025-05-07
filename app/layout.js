import './globals.css'
import styles from '@/app/styles/styles.module.css'
export const metadata = {
  title: 'Coupon Website | Advice',
  description: 'LINE LIFF Integration Example',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        {/* ปรับให้ responsive บนมือถือ */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${styles.fonts}`}>
        {children}
      </body>
    </html>
  )
}