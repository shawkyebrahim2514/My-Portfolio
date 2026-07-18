import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {useCallback, useEffect, useRef, useState} from 'react'
import {ObjectInputProps, set} from 'sanity'

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

type Preview = Required<Pick<LinkPreviewValue, 'url'>> &
  Omit<LinkPreviewValue, '_key' | '_type' | 'url'>

const endpoint =
  process.env.SANITY_STUDIO_LINK_PREVIEW_ENDPOINT ??
  (window.location.hostname === 'localhost' ? 'http://localhost:3000/api/link-preview' : undefined)

export function LinkPreviewInput(props: ObjectInputProps<LinkPreviewValue>) {
  const {value, onChange, renderDefault} = props
  const lastAttemptedUrl = useRef<string | undefined>(undefined)
  const [resolving, setResolving] = useState(false)
  const [error, setError] = useState<string>()

  const resolvePreview = useCallback(async () => {
    if (!value?.url || resolving) return
    if (!endpoint) {
      setError('Link previews are not configured. Set SANITY_STUDIO_LINK_PREVIEW_ENDPOINT and redeploy Studio.')
      return
    }
    try {
      new URL(value.url)
    } catch {
      return
    }

    lastAttemptedUrl.current = value.url
    setResolving(true)
    setError(undefined)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: value.url}),
      })
      const result = (await response.json()) as Preview & {error?: string}
      if (!response.ok) throw new Error(result.error || 'Unable to resolve the preview')
      onChange(set({...value, ...result}))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to resolve the preview')
    } finally {
      setResolving(false)
    }
  }, [onChange, resolving, value])

  useEffect(() => {
    if (value?.url && value.url !== lastAttemptedUrl.current) {
      const timeout = window.setTimeout(() => void resolvePreview(), 700)
      return () => window.clearTimeout(timeout)
    }
  }, [resolvePreview, value?.url])

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Card padding={3} radius={2} tone={error ? 'critical' : 'transparent'} border>
        <Flex align="center" gap={3} justify="space-between">
          <Text size={1}>
            {error ||
              'Metadata is fetched automatically after you paste a URL. You can edit the fields below.'}
          </Text>
          <Button
            text={resolving ? 'Fetching…' : 'Refresh metadata'}
            mode="ghost"
            fontSize={1}
            padding={2}
            disabled={!value?.url || resolving}
            onClick={() => void resolvePreview()}
          />
        </Flex>
      </Card>
    </Stack>
  )
}
