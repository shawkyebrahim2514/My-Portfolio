import {ObjectInputProps} from 'sanity'
import {LinkMetadataInput} from './LinkMetadataInput'

type LinkPreviewValue = {
  _key?: string
  _type?: string
  url?: string
  title?: string
  description?: string
  image?: {_type?: 'image'; asset?: {_type?: 'reference'; _ref?: string}; sourceUrl?: string}
  siteName?: string
  favicon?: {_type?: 'image'; asset?: {_type?: 'reference'; _ref?: string}; sourceUrl?: string}
}

export function LinkPreviewInput(props: ObjectInputProps<LinkPreviewValue>) {
  return <LinkMetadataInput props={props} sourceField="siteName" />
}
