import {BsBookmark, BsCollectionPlay, BsShare} from 'react-icons/bs'
import {TbWorldCode} from 'react-icons/tb'
import type {StructureResolver} from 'sanity/structure'

export const HUB_PAGE_ID = 'hubPage-singleton'
export const FOLLOWS_PAGE_ID = 'hubChannelsDirectoryPage-singleton'
export const LIBRARY_PAGE_ID = 'hubLibraryPage-singleton'
export const PORTFOLIO_ID = '38ff5cc9-0723-4e11-8279-0f7fbb323a33'

export const singletonTypes = new Set([
  'portfolio',
  'hubPage',
  'hubChannelsDirectoryPage',
  'hubLibraryPage',
])

const hubTypeIds = new Set([
  'hubPage',
  'hubChannelsDirectoryPage',
  'hubLibraryPage',
  'hubEntry',
  'hubFollow',
  'hubLibraryCollection',
  'hubLibrarySave',
  'hubCategory',
])

const portfolioItemTypeIds = new Set([
  'professionalExperience',
  'internships',
  'certificates',
  'collegeCourses',
  'projects',
  'skills',
  'contacts',
])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Portfolio')
        .icon(TbWorldCode)
        .child(
          S.list()
            .title('Portfolio')
            .items([
              S.listItem()
                .title('Pages')
                .id('portfolio-pages')
                .icon(TbWorldCode)
                .child(
                  S.document()
                    .title('Pages')
                    .schemaType('portfolio')
                    .documentId(PORTFOLIO_ID),
                ),
              S.divider(),
              S.documentTypeListItem('professionalExperience'),
              S.documentTypeListItem('internships'),
              S.documentTypeListItem('certificates'),
              S.documentTypeListItem('collegeCourses'),
              S.documentTypeListItem('projects'),
              S.documentTypeListItem('skills'),
              S.documentTypeListItem('contacts'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Hub')
        .icon(BsShare)
        .child(
          S.list()
            .title('Hub')
            .items([
              S.listItem()
                .title('Hub index')
                .id('hub-index')
                .icon(BsShare)
                .child(
                  S.document()
                    .title('Hub index')
                    .schemaType('hubPage')
                    .documentId(HUB_PAGE_ID),
                ),
              S.listItem()
                .title('Follows page')
                .id('follows-page')
                .icon(BsCollectionPlay)
                .child(
                  S.document()
                    .title('Follows page')
                    .schemaType('hubChannelsDirectoryPage')
                    .documentId(FOLLOWS_PAGE_ID),
                ),
              S.listItem()
                .title('Library page')
                .id('library-page')
                .icon(BsBookmark)
                .child(
                  S.document()
                    .title('Library page')
                    .schemaType('hubLibraryPage')
                    .documentId(LIBRARY_PAGE_ID),
                ),
              S.divider(),
              S.documentTypeListItem('hubEntry').title('Entries'),
              S.documentTypeListItem('hubFollow').title('Follows'),
              S.documentTypeListItem('hubLibraryCollection').title('Library collections'),
              S.documentTypeListItem('hubLibrarySave').title('Library saves'),
              S.documentTypeListItem('hubCategory').title('Categories'),
            ]),
        ),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return (
          Boolean(id) &&
          id !== 'portfolio' &&
          !hubTypeIds.has(id) &&
          !portfolioItemTypeIds.has(id)
        )
      }),
    ])
