import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import { FOOTER_HTML, NAV_HTML } from '@/raw/fragments.gen'
import type { Media, Objektid } from '@/payload-types'

/* Objekti detailvaade: koik pildid (kaanepilt + galerii) ja taisinfo. */

export const dynamic = 'force-dynamic'

const STAATUSED: Record<string, string> = {
  muugis: 'Müügis',
  broneeritud: 'Broneeritud',
  muudud: 'Müüdud',
}

async function getObjekt(slug: string): Promise<Objektid | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'objektid',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as Objektid) || null
}

function koikPildid(o: Objektid): Media[] {
  const pildid: Media[] = []
  const kaas = o.thumbnail as Media
  if (kaas?.url) pildid.push(kaas)
  for (const p of o.pildid || []) {
    const m = p as Media
    if (m?.url && !pildid.some((x) => x.id === m.id)) pildid.push(m)
  }
  return pildid
}

type Args = { params: Promise<{ slug: string }> }

export default async function ObjektPage({ params }: Args) {
  const { slug } = await params
  const objekt = await getObjekt(decodeURIComponent(slug))
  if (!objekt) return notFound()

  const pildid = koikPildid(objekt)
  const [esimene, ...ylejaanud] = pildid

  return (
    <main id="main-content">
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: NAV_HTML }} />

      <section className="objekt-detail">
        <div className="container">
          <a className="objekt-tagasi" href="/objektid">
            ← Kõik objektid
          </a>

          <div className="objekt-detail-pais">
            <div>
              <div className="objekt-asukoht">{objekt.asukoht}</div>
              <h1 className="objekt-detail-pealkiri">{objekt.pealkiri}</h1>
            </div>
            <div className="objekt-detail-meta">
              {objekt.staatus && (
                <span className={`objekt-staatus objekt-staatus--${objekt.staatus}`}>
                  {STAATUSED[objekt.staatus]}
                </span>
              )}
              {objekt.hind && <div className="objekt-detail-hind">{objekt.hind}</div>}
            </div>
          </div>

          {esimene && (
            <div className="objekt-galerii">
              <div className="objekt-galerii-suur">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={esimene.alt || objekt.pealkiri} src={esimene.sizes?.large?.url || esimene.url || ''} />
              </div>
              {ylejaanud.length > 0 && (
                <div className="objekt-galerii-grid">
                  {ylejaanud.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={p.alt || objekt.pealkiri} key={p.id} src={p.sizes?.large?.url || p.url || ''} loading="lazy" />
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="objekt-detail-sisu">
            <h2>Kirjeldus</h2>
            <p>{objekt.kirjeldus}</p>
          </div>

          <div className="objekt-detail-cta">
            <p>Huvitatud sellest objektist? Võtke meiega ühendust.</p>
            <a className="btn btn-primary" href="/kontakt">
              Võta ühendust
            </a>
          </div>
        </div>
      </section>

      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />
    </main>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const objekt = await getObjekt(decodeURIComponent(slug))
  if (!objekt) return {}
  return {
    title: `${objekt.pealkiri} — Linna Kinnisvara`,
    description: objekt.kirjeldus?.slice(0, 160),
  }
}
