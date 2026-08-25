import type {CSSProperties} from 'react';

export type RemoteImageCrop =
    | 'top'
    | 'center'
    | 'bottom'
    | 'custom'
    | {
          preset?: 'top' | 'center' | 'bottom' | 'custom';
          x?: number;
          y?: number;
          zoom?: number;
      };

const PRESET_POSITION = {
    top: 'center top',
    center: 'center center',
    bottom: 'center bottom',
} as const;

function resolvePreset(
    crop: RemoteImageCrop | null | undefined,
    fallback: 'top' | 'center',
): 'top' | 'center' | 'bottom' | 'custom' {
    if (!crop) return fallback;
    if (typeof crop === 'string') {
        return crop === 'center' || crop === 'bottom' || crop === 'custom' ? crop : fallback;
    }
    return crop.preset === 'center' || crop.preset === 'bottom' || crop.preset === 'custom' || crop.preset === 'top'
        ? crop.preset
        : fallback;
}

function resolvePosition(crop?: RemoteImageCrop | null, fallback: 'top' | 'center' = 'top') {
    const preset = resolvePreset(crop, fallback);
    if (preset === 'custom' && crop && typeof crop === 'object') {
        return `${crop.x ?? 50}% ${crop.y ?? 50}%`;
    }
    if (preset === 'custom') return PRESET_POSITION[fallback];
    return PRESET_POSITION[preset];
}

function resolveZoom(crop?: RemoteImageCrop | null) {
    if (!crop || typeof crop === 'string') return 100;
    const zoom = crop.zoom ?? 100;
    if (!Number.isFinite(zoom)) return 100;
    return Math.min(200, Math.max(100, zoom));
}

function resolveOrigin(crop?: RemoteImageCrop | null, fallback: 'top' | 'center' = 'top') {
    if (crop && typeof crop === 'object' && crop.preset === 'custom') {
        return {x: crop.x ?? 50, y: crop.y ?? 50};
    }
    const preset = resolvePreset(crop, fallback);
    if (preset === 'center') return {x: 50, y: 50};
    if (preset === 'bottom') return {x: 50, y: 100};
    return {x: 50, y: 0};
}

export function resolveRemoteImageStyle(
    crop?: RemoteImageCrop | null,
    fallback: 'top' | 'center' = 'top',
): CSSProperties {
    const scale = resolveZoom(crop) / 100;
    const origin = resolveOrigin(crop, fallback);
    return {
        objectPosition: resolvePosition(crop, fallback),
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        maxWidth: 'none',
        left: `${origin.x * (1 - scale)}%`,
        top: `${origin.y * (1 - scale)}%`,
        right: 'auto',
        bottom: 'auto',
    };
}

export function resolveYouTubeBannerUrl(url: string) {
    if (!url.includes('fcrop64=')) return url;
    const eq = url.lastIndexOf('=');
    return eq === -1 ? url : `${url.slice(0, eq)}=w2560`;
}
