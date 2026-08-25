import type { CollectionConfig } from 'payload'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '../fields/slug'

/* Blogi (Turuulevaated): klient saab ise artikleid ja igakuisi ulevaateid lisada.
   Vanad artiklid on seemnestatud originaalsaidilt legacyHtml valjana (kuvatakse
   muutmata kujul); uued artiklid kirjutatakse rikkaliku tekstiredaktoriga. */
export const Artiklid: CollectionConfig = {
  slug: 'artiklid',
  labels: {
    singular: 'Artikkel',
    plural: 'Artiklid',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'pealkiri',
    defaultColumns: ['pealkiri', 'kategooria', 'kuupaev', 'updatedAt'],
    description: 'Turuülevaated ja nõuanded — kuvatakse lehel /blog',
  },
  fields: [
    {
      name: 'pealkiri',
      type: 'text',
      required: true,
      label: 'Pealkiri',
    },
    {
      name: 'kategooria',
      type: 'select',
      required: true,
      label: 'Kategooria',
      defaultValue: 'turuulevaated',
      options: [
        { label: 'Turuülevaated', value: 'turuulevaated' },
        { label: 'Nõuanded', value: 'nouanded' },
      ],
    },
    {
      name: 'kuupaev',
      type: 'date',
      required: true,
      label: 'Kuupäev',
      admin: {
        date: { displayFormat: 'd.MM.yyyy' },
        position: 'sidebar',
      },
    },
    {
      name: 'kaanepilt',
      type: 'upload',
      relationTo: 'media',
      label: 'Kaanepilt',
      admin: { description: 'Kuvatakse blogi nimekirjas ja artikli päises' },
    },
    {
      name: 'tutvustus',
      type: 'textarea',
      required: true,
      label: 'Tutvustus',
      admin: { description: 'Lühikokkuvõte, kuvatakse blogi nimekirja kaardil' },
    },
    {
      name: 'sisu',
      type: 'richText',
      label: 'Sisu',
      editor: lexicalEditor({
        features: [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          LinkFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Artikli sisutekst. Pealkirjad, loetelud ja lingid redaktorist.',
        condition: (data) => !data?.legacyHtml,
      },
    },
    {
      name: 'legacyHtml',
      type: 'textarea',
      label: 'Vana saidi HTML',
      admin: {
        hidden: true, // seemnestatud vanad artiklid; uued kaivad "Sisu" kaudu
      },
    },
    ...slugField('pealkiri'),
  ],
}
