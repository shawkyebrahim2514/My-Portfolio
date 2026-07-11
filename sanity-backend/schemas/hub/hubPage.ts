import { BsShare } from 'react-icons/bs'
import { commanTitle, changeDocumentPreviewTitle } from '../portfolio/commanFields'
import { richContentOf } from '../objects/richContent'

// Singleton page-level config for the /hub index — mirrors the
// portfolio/*Page.ts convention (title + intro copy), but lives as its own
// top-level document (like `portfolio`) rather than inside
// `portfolio.pages`, since Hub is intentionally NOT one of the fixed 6
// navbar pages (see utilities.ts `portfolioPagesRestrition`).
export const hubPage = {
    name: 'hubPage',
    type: 'document',
    title: 'Hub Page',
    icon: BsShare,
    ...changeDocumentPreviewTitle('Hub Page'),
    fields: [
        commanTitle,
        {
            name: 'intro',
            type: 'array',
            title: 'Intro',
            description: 'Short intro shown at the top of the /hub index page.',
            of: richContentOf,
            validation: Rule => Rule.required(),
        },
    ],
}
