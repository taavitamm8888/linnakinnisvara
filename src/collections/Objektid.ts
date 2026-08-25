import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/* Kliendi hallatavad kinnisvaraobjektid. Väljad Marti briefi järgi:
   asukoht, thumbnail, pealkiri, kirjeldus. */
export const Objektid: CollectionConfig = {
  slug: 'objektid',
  labels: {
    singular: 'Objekt',
    plural: 'Objektid',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'pealkiri',
    defaultColumns: ['pealkiri', 'asukoht', 'staatus', 'updatedAt'],
  },
  fields: [
    {
      name: 'pealkiri',
      type: 'text',
      required: true,
      label: 'Pealkiri',
    },
    {
      name: 'asukoht',
      type: 'text',
      required: true,
      label: 'Asukoht',
      admin: { description: 'Nt "Kesklinn, Tartu" või "Viimsi, Harjumaa"' },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Pilt',
    },
    {
      name: 'kirjeldus',
      type: 'textarea',
      required: true,
      label: 'Kirjeldus',
    },
    {
      name: 'hind',
      type: 'text',
      label: 'Hind',
      admin: { description: 'Nt "185 000 €" või "Hind kokkuleppel". Võib tühjaks jätta.' },
    },
    {
      name: 'staatus',
      type: 'select',
      label: 'Staatus',
      defaultValue: 'muugis',
      options: [
        { label: 'Müügis', value: 'muugis' },
        { label: 'Broneeritud', value: 'broneeritud' },
        { label: 'Müüdud', value: 'muudud' },
      ],
    },
    {
      name: 'jarjekord',
      type: 'number',
      label: 'Järjekord',
      admin: {
        position: 'sidebar',
        description: 'Väiksem number kuvatakse eespool',
      },
    },
  ],
}
