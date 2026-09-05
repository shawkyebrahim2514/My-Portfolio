import {ObjectInputProps} from 'sanity'
import {LinkMetadataInput} from './LinkMetadataInput'

type ReadingItemValue = {
  _key?: string
  _type?: string
  url?: string
  title?: string
  source?: string
  favicon?: {_type?: 'image'; asset?: {_type?: 'reference'; _ref?: string}; sourceUrl?: string}
}

export function ReadingItemInput(props: ObjectInputProps<ReadingItemValue>) {
  return <LinkMetadataInput props={props} sourceField="source" />
}
