import {ObjectInputProps} from 'sanity'
import {LinkMetadataInput} from './LinkMetadataInput'

type LinkPreviewValue = {
  _key?: string
  _type?: string
  url?: string
  title?: string
  description?: string
  imageUrl?: string
  siteName?: string
  faviconUrl?: string
}

export function LinkPreviewInput(props: ObjectInputProps<LinkPreviewValue>) {
  return <LinkMetadataInput props={props} sourceField="siteName" />
}
