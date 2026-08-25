import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import { BlogiNimekiri, KATEGOORIAD } from '@/components/Blogi'
import { FOOTER_HTML, NAV_HTML } from '@/raw/fragments.gen'
import type { Artiklid } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ kat: string }> }

export default async function BlogCategoryPage({ params }: Args) {
  const { kat } = await params
  if (!KATEGOORIAD[kat]) return notFound()

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'artiklid',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: '-kuupaev',
    where: { kategooria: { equals: kat } },
  })

  return (
    <main id="main-content">
      <div dangerouslySetInnerHTML={{ __html: NAV_HTML }} />
      <BlogiNimekiri aktiivne={kat} artiklid={result.docs as Artiklid[]} />
      <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />
    </main>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { kat } = await params
  const nimi = KATEGOORIAD[kat]
  if (!nimi) return {}
  return {
    title: `${nimi} · Turuülevaated · Linna Kinnisvara`,
  }
}
