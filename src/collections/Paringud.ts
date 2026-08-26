import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

/* Kontaktivormi paringud. Vorm postitab avalikult /api/paringud pihta,
   klient naeb laekunud paringuid admin paneelis objektide korval. */
export const Paringud: CollectionConfig = {
  slug: 'paringud',
  labels: {
    singular: 'Päring',
    plural: 'Päringud',
  },
  access: {
    create: () => true, // avalik kontaktivorm
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'nimi',
    defaultColumns: ['nimi', 'email', 'telefon', 'teema', 'createdAt'],
    description: 'Kodulehe kontaktivormi kaudu laekunud päringud',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Honeypot: peidetud "website" välja täidavad ainult robotid
        if (data && typeof data === 'object') {
          if ((data as Record<string, unknown>).website) {
            throw new Error('Päringut ei saadetud')
          }
          delete (data as Record<string, unknown>).website
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc
        // E-posti teavitus käib läbi Netlify Formsi silla (tasuta, SMTP-d pole vaja):
        // edastame päringu serveripoolselt registreeritud vormi, Netlify saadab
        // e-kirja teavituse (konksud skoobitud form_name järgi Netlify halduses).
        try {
          const body = new URLSearchParams({
            'form-name': 'linnakinnisvara-kontakt',
            veeb: '',
            nimi: doc.nimi || '',
            email: doc.email || '',
            telefon: doc.telefon || '',
            teema: doc.teema || '',
            sonum: doc.sonum || '',
          })
          const res = await fetch(process.env.TEAVITUS_SILD_URL || 'https://metsahind.netlify.app/', {
            body: body.toString(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
          })
          if (!res.ok) {
            req.payload.logger.error(`Päringu teavitussild vastas ${res.status}`)
          }
        } catch (err) {
          req.payload.logger.error(`Päringu teavituse saatmine ebaõnnestus: ${err}`)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'nimi',
      type: 'text',
      required: true,
      label: 'Nimi',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-post',
    },
    {
      name: 'telefon',
      type: 'text',
      required: true,
      label: 'Telefon',
    },
    {
      name: 'teema',
      type: 'text',
      label: 'Teema',
    },
    {
      name: 'sonum',
      type: 'textarea',
      required: true,
      label: 'Sõnum',
    },
  ],
}
