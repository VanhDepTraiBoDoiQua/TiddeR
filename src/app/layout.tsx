import '@/styles/globals.css'

export const metadata = {
  title: "TiddeR",
  description: "Everything you need",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
