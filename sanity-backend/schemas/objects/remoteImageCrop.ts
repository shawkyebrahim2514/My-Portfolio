import {RemoteImageCropInput} from '../../components/RemoteImageCropInput'

export const remoteImageCrop = {
  name: 'remoteImageCrop',
  type: 'object',
  title: 'Image crop',
  components: {input: RemoteImageCropInput},
  fields: [
    {
      name: 'preset',
      type: 'string',
      title: 'Preset',
      options: {
        list: [
          {title: 'Top', value: 'top'},
          {title: 'Center', value: 'center'},
          {title: 'Bottom', value: 'bottom'},
          {title: 'Custom', value: 'custom'},
        ],
        layout: 'radio',
      },
    },
    {
      name: 'x',
      type: 'number',
      title: 'Horizontal %',
      description: '0 is left, 100 is right.',
      hidden: ({parent}) => parent?.preset !== 'custom',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'y',
      type: 'number',
      title: 'Vertical %',
      description: '0 is top, 100 is bottom.',
      hidden: ({parent}) => parent?.preset !== 'custom',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'zoom',
      type: 'number',
      title: 'Zoom %',
      description: '100 fills the frame. 200 punches in on the focus point.',
      validation: (Rule) => Rule.min(100).max(200),
    },
  ],
}
