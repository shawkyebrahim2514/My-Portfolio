import {ObjectInputProps} from 'sanity'
import {LinkMetadataInput} from './LinkMetadataInput'

type ReadingItemValue = {
  _key?: string
  _type?: string
  url?: string
  title?: string
  source?: string
  faviconUrl?: string
}

export function ReadingItemInput(props: ObjectInputProps<ReadingItemValue>) {
  return <LinkMetadataInput props={props} sourceField="source" />
}
