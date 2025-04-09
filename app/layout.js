import './globals.css'

export const metadata = {
  title: 'LINE LIFF App',
  description: 'LINE LIFF Integration Example',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}