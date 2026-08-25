import type { Metadata } from 'next'
import React from 'react'
import Script from 'next/script'

import { getServerSideURL } from '@/utilities/getURL'

/* Linnakinnisvara.ee port: lehed on originaalsait pixel-perfect kujul (src/raw),
   stiil tuleb originaali style.css failist (fondivahetusega), mitte Tailwindist.
   Seetõttu EI impordi see layout globals.css faili. */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:ital,wght@0,300..800;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/templates/linnakinnisvara/assets/style.css" />
      </head>
      <body>
        {children}
        <Script src="/templates/linnakinnisvara/assets/main.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
}
