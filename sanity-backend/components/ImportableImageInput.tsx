import {Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ObjectInputProps, set, setIfMissing, unset, useClient} from 'sanity'

type ImportableImageValue = {
  _type?: 'image'
  asset?: {_type?: 'reference'; _ref?: string}
  sourceUrl?: string
  [key: string]: unknown
}

const endpoint =
  process.env.SANITY_STUDIO_IMAGE_IMPORT_ENDPOINT ??
  (window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/image-import'
    : 'https://www.shawkyebrahim.me/api/image-import')

const EXTENSION_BY_TYPE: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function importFilename(url: string, contentType: string) {
  const extension = EXTENSION_BY_TYPE[contentType] ?? 'img'
  try {
    const basename = new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? 'remote-image'
    const stem = basename.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 80)
    return `${stem || 'remote-image'}.${extension}`
  } catch {
    return `remote-image.${extension}`
  }
}

export function ImportableImageInput(props: ObjectInputProps<ImportableImageValue>) {
  const client = useClient({apiVersion: '2023-01-01'})
  const [sourceUrl, setSourceUrl] = useState(props.value?.sourceUrl ?? '')
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string>()
  const hasAsset = Boolean(props.value?.asset?._ref)
  const importedSource = props.value?.sourceUrl
  const sourceChanged = Boolean(hasAsset && sourceUrl && sourceUrl !== importedSource)
  const currentAssetRef = useRef(props.value?.asset?._ref)
  const currentSourceRef = useRef(sourceUrl)
  currentAssetRef.current = props.value?.asset?._ref
  currentSourceRef.current = sourceUrl

  useEffect(() => {
    setSourceUrl(props.value?.sourceUrl ?? '')
  }, [props.value?.sourceUrl])

  const status = useMemo(() => {
    if (error) return error
    if (sourceChanged) return 'The source URL changed. The current Sanity image stays live until replacement succeeds.'
    if (hasAsset && importedSource) return 'Stored permanently in Sanity from this source URL.'
    if (hasAsset) return 'Stored permanently in Sanity.'
    return 'Paste an image URL, then import it. Manual upload remains available below.'
  }, [error, hasAsset, importedSource, sourceChanged])

  const importImage = useCallback(async () => {
    const trimmedUrl = sourceUrl.trim()
    if (!trimmedUrl || importing) return
    try {
      new URL(trimmedUrl)
    } catch {
      setError('Enter a valid HTTP(S) image URL.')
      return
    }

    setImporting(true)
    setError(undefined)
    const startingAssetRef = currentAssetRef.current
    try {
      const parsedUrl = new URL(trimmedUrl)
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Only HTTP(S) image URLs are supported.')
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${client.config().token ?? ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({url: trimmedUrl}),
      })
      if (!response.ok) {
        const result = (await response.json().catch(() => undefined)) as {error?: string} | undefined
        throw new Error(result?.error || `Image download failed (${response.status})`)
      }

      const blob = await response.blob()
      const asset = await client.assets.upload('image', blob, {
        filename: importFilename(trimmedUrl, blob.type),
        source: {id: trimmedUrl, name: 'Imported from URL', url: trimmedUrl},
      })
      if (
        currentAssetRef.current !== startingAssetRef ||
        currentSourceRef.current.trim() !== trimmedUrl
      ) {
        throw new Error('The image or source URL changed while importing. The newer edit was kept.')
      }
      props.onChange([
        setIfMissing({_type: 'image'}),
        set({_type: 'reference', _ref: asset._id}, ['asset']),
        set(trimmedUrl, ['sourceUrl']),
        unset(['crop']),
        unset(['hotspot']),
      ])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to import image')
    } finally {
      setImporting(false)
    }
  }, [client, importing, props, sourceUrl])

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} tone={error ? 'critical' : 'transparent'} border>
        <Stack space={3}>
          <TextInput
            aria-label="Source image URL"
            placeholder="https://…"
            value={sourceUrl}
            onChange={(event) => {
              setSourceUrl(event.currentTarget.value)
              setError(undefined)
            }}
          />
          <Text muted={!error} size={1}>
            {status}
          </Text>
          <Flex gap={2} wrap="wrap">
            <Button
              text={
                importing
                  ? 'Importing…'
                  : hasAsset
                    ? sourceChanged
                      ? 'Replace from URL'
                      : 'Re-import from URL'
                    : 'Import from URL'
              }
              tone="primary"
              disabled={!sourceUrl.trim() || importing}
              onClick={() => void importImage()}
            />
            {hasAsset && (
              <Button
                text="Remove image"
                mode="ghost"
                tone="critical"
                disabled={importing}
                onClick={() => props.onChange(unset())}
              />
            )}
          </Flex>
        </Stack>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
