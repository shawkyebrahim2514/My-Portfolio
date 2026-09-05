import {Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {useCallback, useEffect, useRef, useState} from 'react'
import {ObjectInputProps, set, setIfMissing, unset} from 'sanity'

type ChannelValue = {
  _type?: string
  platform?: 'youtube' | 'github' | 'linkedin' | 'facebook' | 'podcast' | 'website' | 'twitter'
  url?: string
  name?: string
  channelId?: string
  handle?: string
  avatarAsset?: {
    _type?: 'image'
    asset?: {_type?: 'reference'; _ref?: string}
    sourceUrl?: string
  }
}

type ResolvedChannel = {
  name: string
  channelId: string
  handle?: string
  url: string
  avatarUrl?: string
  error?: string
}

const endpoint =
  process.env.SANITY_STUDIO_YOUTUBE_CHANNEL_ENDPOINT ??
  (window.location.hostname === 'localhost'
    ? 'http://localhost:3002/api/youtube-channel'
    : undefined)

export function ChannelInput(props: ObjectInputProps<ChannelValue>) {
  const {value, onChange, renderDefault} = props
  // Existing documents should not fetch merely because the editor opened.
  // A changed/pasted URL still resolves automatically.
  const lastAttemptedUrl = useRef<string | undefined>(value?.url)
  const currentUrl = useRef(value?.url)
  const activeRequest = useRef<AbortController | undefined>(undefined)
  const [resolving, setResolving] = useState(false)
  const [error, setError] = useState<string>()
  currentUrl.current = value?.url

  const resolveChannel = useCallback(async () => {
    if (!value?.url || value.platform !== 'youtube' || resolving) return
    if (!endpoint) {
      setError(
        'YouTube metadata is not configured. Set SANITY_STUDIO_YOUTUBE_CHANNEL_ENDPOINT and redeploy Studio.',
      )
      return
    }

    lastAttemptedUrl.current = value.url
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    const attemptedUrl = value.url
    setResolving(true)
    setError(undefined)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: value.url}),
        signal: controller.signal,
      })
      const result = (await response.json()) as ResolvedChannel
      if (!response.ok) throw new Error(result.error || 'Unable to resolve the channel')
      if (currentUrl.current !== attemptedUrl) return
      const patches = [
        set(result.name, ['name']),
        set(result.channelId, ['channelId']),
        set(result.url, ['url']),
        result.handle ? set(result.handle, ['handle']) : unset(['handle']),
        ...(result.avatarUrl
          ? [
              setIfMissing({_type: 'image'}, ['avatarAsset']),
              set(result.avatarUrl, ['avatarAsset', 'sourceUrl']),
            ]
          : []),
      ]
      onChange(patches)
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      setError(reason instanceof Error ? reason.message : 'Unable to resolve the channel')
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = undefined
        setResolving(false)
      }
    }
  }, [onChange, resolving, value])

  useEffect(() => {
    if (
      value?.platform === 'youtube' &&
      value.url &&
      value.url !== lastAttemptedUrl.current
    ) {
      const timeout = window.setTimeout(() => void resolveChannel(), 700)
      return () => window.clearTimeout(timeout)
    }
  }, [resolveChannel, value?.platform, value?.url])

  useEffect(
    () => () => {
      activeRequest.current?.abort()
    },
    [value?.platform, value?.url],
  )

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Card padding={3} radius={2} tone={error ? 'critical' : 'transparent'} border>
        <Flex align="center" gap={3} justify="space-between">
          <Text size={1}>
            {error ||
              (value?.platform === 'youtube'
                ? 'Name, stable ID, handle, canonical URL, and remote avatar URL are refreshed from YouTube.'
                : 'Automatic metadata is currently available for YouTube channels only.')}
          </Text>
          <Button
            text={resolving ? 'Fetching…' : 'Refresh metadata'}
            mode="ghost"
            fontSize={1}
            padding={2}
            disabled={!value?.url || value.platform !== 'youtube' || resolving}
            onClick={() => void resolveChannel()}
          />
        </Flex>
      </Card>
    </Stack>
  )
}
