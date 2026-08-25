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
        // E-posti teavitus: töötab kohe, kui payload.config-i on lisatud
        // email adapter (SMTP nt Zone postkastiga). Ilma adapterita logib
        // Payload kirja konsooli ja päring salvestub ikkagi adminisse.
        try {
          await req.payload.sendEmail({
            to: process.env.PARINGU_TEAVITUS_EMAIL || 'info@linnakinnisvara.ee',
            subject: `Uus päring kodulehelt: ${doc.nimi}`,
            html: [
              `<p><strong>Nimi:</strong> ${doc.nimi}</p>`,
              `<p><strong>E-post:</strong> ${doc.email}</p>`,
              `<p><strong>Telefon:</strong> ${doc.telefon}</p>`,
              doc.teema ? `<p><strong>Teema:</strong> ${doc.teema}</p>` : '',
              `<p><strong>Sõnum:</strong></p><p>${String(doc.sonum || '').replace(/\n/g, '<br>')}</p>`,
            ].join(''),
          })
        } catch (err) {
          req.payload.logger.error(`Päringu e-kirja saatmine ebaõnnestus: ${err}`)
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
