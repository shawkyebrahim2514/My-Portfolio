import { BsCollectionPlay } from 'react-icons/bs'
import { commanTitle } from '../portfolio/commanFields'
import { richContentOf } from '../objects/richContent'

export const hubChannelsDirectoryPage = {
  name: 'hubChannelsDirectoryPage',
  type: 'document',
  title: 'Follows page',
  icon: BsCollectionPlay,
  fields: [
    commanTitle,
    {
      name: 'intro',
      type: 'array',
      title: 'Intro',
      description: 'Intro copy shown at the top of /hub/follows. The cards come from Follow documents.',
      of: richContentOf,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {title: 'title.highlightedText'},
    prepare: ({title}) => ({
      title: title || 'Follows page',
      subtitle: 'Title and intro for /hub/follows',
    }),
  },
}
