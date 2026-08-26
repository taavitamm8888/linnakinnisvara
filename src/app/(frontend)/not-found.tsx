import React from 'react'

import { FOOTER_HTML, NAV_HTML } from '@/raw/fragments.gen'

export default function NotFound() {
  return (
    <main id="main-content">
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: NAV_HTML }} />
      <section className="objektid-hero" style={{ padding: '8rem 0 10rem' }}>
        <div className="container">
          <h1 className="hero-title">Lehte ei leitud</h1>
          <p className="hero-subtitle">
            Seda lehte ei ole olemas või on see ümber kolinud.
          </p>
          <p style={{ marginTop: '2.5rem' }}>
            <a className="btn btn-primary" href="/">
              Tagasi avalehele
            </a>
          </p>
        </div>
      </section>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />
    </main>
  )
}
