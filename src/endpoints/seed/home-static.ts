import type { RequiredDataFromCollectionSlug } from 'payload'

// Staatiline avaleht seni, kuni CMS-i pole sisu seemnestatud.
// Sisu etalon: https://metsahind.com (Titanwood OÜ)
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'highImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Ostame metsamaad, raieõigusi',
                version: 1,
              },
              {
                type: 'linebreak',
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: 'ja valitud piirkondades ka põllumaad.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Aitame leida kinnistule õiglase väärtuse. Ostame metsamaad ja raieõigusi üle Eesti — nii enda finantseeringuga kui Eesti ja välismaa fondide toel. Tehingud teostame diskreetselt ning professionaalselt.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            textStyle: '',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Võtke ühendust',
          url: '/kontakt',
        },
      },
    ],
  },
  meta: {
    description:
      'Ostame metsamaad, raieõigusi ja valitud piirkondades ka põllumaad üle Eesti. Aitame leida kinnistule õiglase väärtuse.',
    title: 'Titanwood — Metsa ja põllumaa ost',
  },
  title: 'Avaleht',
  layout: [],
}
