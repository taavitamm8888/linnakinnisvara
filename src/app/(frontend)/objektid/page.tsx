import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { FOOTER_HTML, NAV_HTML } from '@/raw/fragments.gen'
import type { Media, Objektid } from '@/payload-types'

/* Objektide leht: ainuke CMS-põhine leht. Navigatsioon ja jalus tulevad
   originaalsaidi fragmentidest, kaardid Payloadi objektid kollektsioonist. */

export const dynamic = 'force-dynamic'

const STAATUSED: Record<string, string> = {
  muugis: 'Müügis',
  broneeritud: 'Broneeritud',
  muudud: 'Müüdud',
}

export default async function ObjektidPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'objektid',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: 'jarjekord',
  })
  const objektid = result.docs as Objektid[]

  return (
    <main id="main-content">
      <div dangerouslySetInnerHTML={{ __html: NAV_HTML }} />

      <section className="objektid-hero">
        <div className="container">
          <h1 className="hero-title">Objektid</h1>
          <p className="hero-subtitle">
            Valik kinnisvara, mida parasjagu müüme. Küsimuste korral võtke meiega ühendust.
          </p>
        </div>
      </section>

      <section className="objektid-grid-sektsioon">
        <div className="container">
          {objektid.length === 0 ? (
            <p className="objektid-tyhi">
              Hetkel aktiivseid objekte ei ole. Vaadake peagi uuesti või{' '}
              <a href="/kontakt">võtke meiega ühendust</a>.
            </p>
          ) : (
            <div className="objektid-grid">
              {objektid.map((o) => {
                const pilt = o.thumbnail as Media
                return (
                  <a className="objekt-kaart" href={`/objektid/${o.slug || o.id}`} key={o.id}>
                    <div className="objekt-pilt">
                      {pilt?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt={pilt.alt || o.pealkiri} src={pilt.url} loading="lazy" />
                      )}
                      {o.staatus && o.staatus !== 'muugis' && (
                        <span className={`objekt-staatus objekt-staatus--${o.staatus}`}>
                          {STAATUSED[o.staatus]}
                        </span>
                      )}
                    </div>
                    <div className="objekt-sisu">
                      <div className="objekt-asukoht">{o.asukoht}</div>
                      <h2 className="objekt-pealkiri">{o.pealkiri}</h2>
                      <p className="objekt-kirjeldus">{o.kirjeldus}</p>
                      {o.hind && <div className="objekt-hind">{o.hind}</div>}
                      <span className="objekt-vaata">Vaata lähemalt →</span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Objektid — Linna Kinnisvara',
  description: 'Valik kinnisvara, mida Linna Kinnisvara parasjagu müüb Tartus ja Tallinnas.',
}
