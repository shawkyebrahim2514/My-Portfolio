import {BsBookmark} from 'react-icons/bs'
import {commanTitle} from '../portfolio/commanFields'
import {richContentOf} from '../objects/richContent'

export const hubLibraryPage = {
  name: 'hubLibraryPage',
  type: 'document',
  title: 'Library page',
  icon: BsBookmark,
  fields: [
    commanTitle,
    {
      name: 'intro',
      type: 'array',
      title: 'Intro',
      description: 'Intro copy shown at the top of /hub/library. Cards come from Library save documents.',
      of: richContentOf,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {title: 'title.highlightedText'},
    prepare: ({title}) => ({
      title: title || 'Library page',
      subtitle: 'Title and intro for /hub/library',
    }),
  },
}
