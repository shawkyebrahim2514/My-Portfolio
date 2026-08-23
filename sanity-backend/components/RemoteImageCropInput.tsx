import {Card, Flex, Stack, Text} from '@sanity/ui'
import {useCallback, type CSSProperties} from 'react'
import {set, useFormValue, type ObjectInputProps} from 'sanity'

type CropPreset = 'top' | 'center' | 'bottom' | 'custom'

export type RemoteImageCropValue = {
  _type?: string
  preset?: CropPreset
  x?: number
  y?: number
  zoom?: number
}

type CropInputOptions = {
  imageField?: string
  previewAspect?: string
  previewRadius?: string
  defaultPreset?: CropPreset
}

const PRESETS: {title: string; value: CropPreset}[] = [
  {title: 'Top', value: 'top'},
  {title: 'Center', value: 'center'},
  {title: 'Bottom', value: 'bottom'},
  {title: 'Custom', value: 'custom'},
]

const PRESET_POSITION: Record<Exclude<CropPreset, 'custom'>, string> = {
  top: 'center top',
  center: 'center center',
  bottom: 'center bottom',
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 50
  return Math.min(100, Math.max(0, Math.round(value)))
}

function clampZoom(value: number) {
  if (!Number.isFinite(value)) return 100
  return Math.min(200, Math.max(100, Math.round(value)))
}

function normalize(value: unknown, defaultPreset: CropPreset): Required<Omit<RemoteImageCropValue, '_type'>> {
  if (typeof value === 'string') {
    const preset: CropPreset =
      value === 'center' || value === 'bottom' || value === 'custom' ? value : defaultPreset
    return {preset, x: 50, y: 50, zoom: 100}
  }

  const next = (value ?? {}) as RemoteImageCropValue
  const preset: CropPreset =
    next.preset === 'center' || next.preset === 'bottom' || next.preset === 'custom' || next.preset === 'top'
      ? next.preset
      : defaultPreset
  return {
    preset,
    x: clampPercent(next.x ?? 50),
    y: clampPercent(next.y ?? 50),
    zoom: clampZoom(next.zoom ?? 100),
  }
}

function previewSrc(url: string) {
  if (!url.includes('fcrop64=')) return url
  const eq = url.lastIndexOf('=')
  return eq === -1 ? url : `${url.slice(0, eq)}=w2560`
}

function objectPosition(focus: Required<Omit<RemoteImageCropValue, '_type'>>) {
  if (focus.preset === 'custom') return `${focus.x}% ${focus.y}%`
  return PRESET_POSITION[focus.preset]
}

function focusOrigin(focus: Required<Omit<RemoteImageCropValue, '_type'>>) {
  if (focus.preset === 'custom') return {x: focus.x, y: focus.y}
  if (focus.preset === 'center') return {x: 50, y: 50}
  if (focus.preset === 'bottom') return {x: 50, y: 100}
  return {x: 50, y: 0}
}

function previewImageStyle(focus: Required<Omit<RemoteImageCropValue, '_type'>>): CSSProperties {
  const scale = focus.zoom / 100
  const origin = focusOrigin(focus)
  return {
    position: 'absolute',
    width: `${scale * 100}%`,
    height: `${scale * 100}%`,
    maxWidth: 'none',
    left: `${origin.x * (1 - scale)}%`,
    top: `${origin.y * (1 - scale)}%`,
    objectFit: 'cover',
    objectPosition: objectPosition(focus),
  }
}

export function RemoteImageCropInput(props: ObjectInputProps<RemoteImageCropValue>) {
  const options = (props.schemaType.options ?? {}) as CropInputOptions
  const imageField = options.imageField ?? 'coverImage'
  const previewAspect = options.previewAspect ?? '3 / 1'
  const previewRadius = options.previewRadius
  const defaultPreset = options.defaultPreset === 'center' ? 'center' : 'top'
  const imageUrl = useFormValue([...props.path.slice(0, -1), imageField]) as string | undefined
  const focus = normalize(props.value, defaultPreset)
  const src = imageUrl ? previewSrc(imageUrl) : undefined

  const patch = useCallback(
    (partial: Partial<RemoteImageCropValue>) => {
      props.onChange(
        set({
          _type: 'remoteImageCrop',
          ...focus,
          ...partial,
        }),
      )
    },
    [focus, props],
  )

  return (
    <Stack space={3}>
      <Flex gap={3} wrap="wrap">
        {PRESETS.map((preset) => (
          <label key={preset.value} style={{display: 'flex', gap: 6, alignItems: 'center'}}>
            <input
              type="radio"
              name={`${props.id}-image-crop`}
              checked={focus.preset === preset.value}
              onChange={() => patch({preset: preset.value})}
            />
            <Text size={1}>{preset.title}</Text>
          </label>
        ))}
      </Flex>

      {focus.preset === 'custom' && (
        <Stack space={3}>
          <label>
            <Flex justify="space-between">
              <Text size={1}>Horizontal</Text>
              <Text muted size={1}>
                {focus.x}%
              </Text>
            </Flex>
            <input
              type="range"
              min={0}
              max={100}
              value={focus.x}
              onChange={(event) => patch({x: Number(event.currentTarget.value)})}
              style={{width: '100%'}}
            />
          </label>
          <label>
            <Flex justify="space-between">
              <Text size={1}>Vertical</Text>
              <Text muted size={1}>
                {focus.y}%
              </Text>
            </Flex>
            <input
              type="range"
              min={0}
              max={100}
              value={focus.y}
              onChange={(event) => patch({y: Number(event.currentTarget.value)})}
              style={{width: '100%'}}
            />
          </label>
        </Stack>
      )}

      <label>
        <Flex justify="space-between">
          <Text size={1}>Zoom</Text>
          <Text muted size={1}>
            {focus.zoom}%
          </Text>
        </Flex>
        <input
          type="range"
          min={100}
          max={200}
          value={focus.zoom}
          onChange={(event) => patch({zoom: Number(event.currentTarget.value)})}
          style={{width: '100%'}}
        />
      </label>

      {src ? (
        <Card overflow="hidden" radius={2} shadow={1}>
          <div
            style={{
              position: 'relative',
              width: previewRadius ? '8rem' : '100%',
              margin: previewRadius ? '0.75rem auto' : undefined,
              aspectRatio: previewAspect,
              overflow: 'hidden',
              background: '#111',
              borderRadius: previewRadius,
            }}
          >
            <img alt="" src={src} style={previewImageStyle(focus)} />
          </div>
          <Card padding={2}>
            <Text muted size={1}>
              Same crop as the Follows card.
            </Text>
          </Card>
        </Card>
      ) : null}
    </Stack>
  )
}
