import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { BlogiNimekiri } from '@/components/Blogi'
import { FOOTER_HTML, NAV_HTML } from '@/raw/fragments.gen'
import type { Artiklid } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'artiklid',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    sort: '-kuupaev',
  })

  return (
    <main id="main-content">
      <div dangerouslySetInnerHTML={{ __html: NAV_HTML }} />
      <BlogiNimekiri aktiivne={null} artiklid={result.docs as Artiklid[]} />
      <div dangerouslySetInnerHTML={{ __html: FOOTER_HTML }} />
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Turuülevaated · Linna Kinnisvara',
  description:
    'Igakuised põhjalikud kokkuvõtted Tallinna ja Tartu kinnisvaraturul toimuvast. Meie ekspertide originaalanalüüsid.',
}
