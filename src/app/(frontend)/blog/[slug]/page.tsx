import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import { KATEGOORIAD, kuupaevEt } from '@/components/Blogi'
import { FOOTER_HTML, NAV_HTML } from '@/raw/fragments.gen'
import type { Artiklid, Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function getArtikkel(slug: string): Promise<Artiklid | null> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'artiklid',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as Artiklid) || null
}

type Args = { params: Promise<{ slug: string }> }

export default async function ArtikkelPage({ params }: Args) {
  const { slug } = await params
  const artikkel = await getArtikkel(decodeURIComponent(slug))
  if (!artikkel) return notFound()

  const pilt = artikkel.kaanepilt as Media | null
  const sisuHtml = artikkel.legacyHtml
    ? artikkel.legacyHtml
    : artikkel.sisu
      ? convertLexicalToHTML({ data: artikkel.sisu })
      : ''

  return (
    <main id="main-content">
      <div dangerouslySetInnerHTML={{ __html: NAV_HTML }} />

      <section className="blog-hero">
        <div className="container">
          <nav aria-label="Teekond" className="blog-breadcrumb">
            <a href="/">Avaleht</a>
            <span>/</span>
            <a href="/blog">Turuülevaated</a>
            <span>/</span>
            <span>{artikkel.pealkiri}</span>
          </nav>
          <span className="blog-post-cat">{KATEGOORIAD[artikkel.kategooria] || ''}</span>
          <h1>{artikkel.pealkiri}</h1>
          <p>
            <time>{kuupaevEt(artikkel.kuupaev)}</time>
          </p>
        </div>
      </section>

      <div className="container blog-post-wrap">
        {pilt?.url && (
          <div className="blog-post-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={artikkel.pealkiri} src={pilt.url} />
          </div>
        )}
        <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: sisuHtml }} />
      </div>

      <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />
    </main>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const artikkel = await getArtikkel(decodeURIComponent(slug))
  if (!artikkel) return {}
  return {
    title: `${artikkel.pealkiri} · Linna Kinnisvara`,
    description: artikkel.tutvustus?.slice(0, 160),
  }
}
