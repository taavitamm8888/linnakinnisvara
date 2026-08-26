import React from 'react'

import type { Artiklid, Media } from '@/payload-types'

/* Blogi jagatud tükid: kategooriad, eesti kuupäev, kaart ja nimekirjavaade.
   Markup kordab originaalsaidi blogi klasse (blog-hero, blog-card jne). */

export const KATEGOORIAD: Record<string, string> = {
  turuulevaated: 'Turuülevaated',
  nouanded: 'Nõuanded',
}

const KUUD = [
  'jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni',
  'juuli', 'august', 'september', 'oktoober', 'november', 'detsember',
]

export function kuupaevEt(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()}. ${KUUD[d.getMonth()]} ${d.getFullYear()}`
}

export function BlogiKaart({ artikkel }: { artikkel: Artiklid }) {
  const pilt = artikkel.kaanepilt as Media | null
  // nimekirjas piisab keskmisest variandist (900px), originaal on kordi raskem
  const piltUrl = pilt?.sizes?.medium?.url || pilt?.url
  const href = `/blog/${artikkel.slug}`
  return (
    <article className="blog-card">
      {piltUrl && (
        <a className="blog-card__img-link" href={href}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={artikkel.pealkiri} loading="lazy" src={piltUrl} />
        </a>
      )}
      <div className="blog-card__body">
        <span className="blog-card__cat">{KATEGOORIAD[artikkel.kategooria] || ''}</span>
        <time className="blog-card__date">{kuupaevEt(artikkel.kuupaev)}</time>
        <h2 className="blog-card__title">
          <a href={href}>{artikkel.pealkiri}</a>
        </h2>
        <p className="blog-card__excerpt">{artikkel.tutvustus}</p>
        <a className="blog-card__more" href={href}>
          Loe edasi &rarr;
        </a>
      </div>
    </article>
  )
}

export function BlogiNimekiri({
  aktiivne,
  artiklid,
}: {
  aktiivne: string | null
  artiklid: Artiklid[]
}) {
  return (
    <>
      <section className="blog-hero">
        <div className="container">
          <h1>Turuülevaated</h1>
          <p>
            Igakuised põhjalikud kokkuvõtted Tallinna ja Tartu kinnisvaraturul toimuvast. Meie
            ekspertide originaalanalüüsid.
          </p>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <div className="blog-cats">
            <a className={`blog-cat-chip${aktiivne === null ? ' is-active' : ''}`} href="/blog">
              Kõik
            </a>
            {Object.entries(KATEGOORIAD).map(([slug, nimi]) => (
              <a
                className={`blog-cat-chip${aktiivne === slug ? ' is-active' : ''}`}
                href={`/blog/category/${slug}`}
                key={slug}
              >
                {nimi}
              </a>
            ))}
          </div>

          {artiklid.length === 0 ? (
            <p style={{ color: 'var(--ink-muted)', padding: '3rem 0' }}>
              Selles kategoorias artikleid veel ei ole.
            </p>
          ) : (
            <div className="blog-grid">
              {artiklid.map((a) => (
                <BlogiKaart artikkel={a} key={a.id} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
