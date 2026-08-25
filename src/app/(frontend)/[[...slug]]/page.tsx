import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { RAW_PAGES } from '@/raw/pages.gen'

/* Originaalsaidi lehed pixel-perfect kujul. Iga leht kannab oma
   navigatsiooni ja jalust ise (porditud tervikuna body sisuna). */

type Args = {
  params: Promise<{ slug?: string[] }>
}

export function generateStaticParams() {
  return Object.keys(RAW_PAGES).map((route) => ({
    slug: route === '' ? undefined : route.split('/'),
  }))
}

function routeOf(slug?: string[]): string {
  return (slug || []).map(decodeURIComponent).join('/')
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  const page = RAW_PAGES[routeOf(slug)]
  if (!page) return notFound()

  return <div dangerouslySetInnerHTML={{ __html: page.html }} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = RAW_PAGES[routeOf(slug)]
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
  }
}
