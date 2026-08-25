import { BsCollectionPlay } from 'react-icons/bs'
import { commanTitle } from '../portfolio/commanFields'
import { richContentOf } from '../objects/richContent'

export const hubChannelsDirectoryPage = {
  name: 'hubChannelsDirectoryPage',
  type: 'document',
  title: 'Hub Channels Directory',
  icon: BsCollectionPlay,
  fields: [
    commanTitle,
    {
      name: 'intro',
      type: 'array',
      title: 'Intro',
      description: 'Intro copy shown at the top of /hub/follows.',
      of: richContentOf,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'channels',
      type: 'array',
      title: 'Directory order',
      description:
        'Public Follows order. Create or edit items under Follows (searchable). Then add them here.',
      of: [{type: 'reference', to: [{type: 'hubFollow'}]}],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!Array.isArray(value) || value.length === 0) return true
          const ids = value.map((item) => item?._ref).filter(Boolean)
          return new Set(ids).size === ids.length ? true : 'Each Follow can only appear once'
        }),
    },
  ],
  preview: {
    select: {channels: 'channels'},
    prepare: ({channels}) => {
      const count = Array.isArray(channels) ? channels.length : 0
      return {
        title: 'Hub Channels Directory',
        subtitle: `${count} directory item${count === 1 ? '' : 's'}`,
      }
    },
  },
}
