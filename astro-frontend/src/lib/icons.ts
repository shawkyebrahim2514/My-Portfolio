import type { ImageMetadata } from 'astro';

/**
 * Skill and contact icons live in `src/assets/icons/**` so Astro's image
 * pipeline can hash, bundle, and optimize them. Content collections store the
 * icon as a legacy public-style path (e.g. `/icons/skills/django.png`), so this
 * map resolves that path to the imported asset metadata.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/icons/**/*.{png,jpg,jpeg,webp,svg,gif,avif}',
  { eager: true },
);

const iconMap = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(modules)) {
  // Normalize the glob key to the public-style path stored in content data.
  const key = path.replace(/^.*\/assets\/icons\//, '/icons/');
  iconMap.set(key, mod.default);
}

/**
 * Resolve a content icon path to its optimized asset metadata.
 * Returns `undefined` when the icon is missing or unmapped so callers can
 * skip rendering rather than emit a broken image.
 */
export function resolveIcon(
  iconPath: string | undefined,
): ImageMetadata | undefined {
  if (!iconPath) return undefined;
  return iconMap.get(iconPath);
}
