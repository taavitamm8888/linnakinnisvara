'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

import heroFallback from '../../../public/media/estonian-forest-aerial.jpg'

/* Titanwoodi avalehe hero: tume metsataust, pilt sulandub paremalt vasakule
   ühtlaseks tumeroheliseks pinnaks, mille peal serif-pealkiri ja CTA. */
export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const hasCMSMedia = media && typeof media === 'object'

  return (
    <section
      className="relative -mt-[10.4rem] flex min-h-svh items-center overflow-hidden bg-[#080c0a] text-white"
      data-theme="dark"
    >
      <div className="absolute inset-0 select-none">
        {hasCMSMedia ? (
          <Media fill imgClassName="object-cover object-[70%_center]" priority resource={media} />
        ) : (
          <Media
            alt="Eesti metsavõra linnulennult"
            fill
            imgClassName="object-cover object-[70%_center]"
            priority
            src={heroFallback}
          />
        )}
        {/* Mobiilis ühtlane tume loor, laiematel ekraanidel sulandumine vasakule */}
        <div className="absolute inset-0 bg-[#080c0a]/70 lg:bg-transparent lg:bg-linear-to-r lg:from-[#080c0a] lg:from-30% lg:via-[#080c0a]/55 lg:via-55% lg:to-transparent lg:to-85%" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#080c0a] to-transparent" />
      </div>

      <div className="container relative z-10 py-36">
        <div className="max-w-[38rem]">
          {richText && <RichText className="hero-titanwood" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li className="max-sm:w-full" key={i}>
                    <CMSLink
                      {...link}
                      className="h-auto rounded-none border border-white/25 bg-transparent px-8 py-4 text-[13px] font-medium tracking-[0.25em] text-white/85 uppercase transition-colors after:ml-3 after:text-[#16a34a] after:content-['→'] hover:border-[#16a34a]/60 hover:bg-[#16a34a]/10 hover:text-white max-sm:w-full"
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
