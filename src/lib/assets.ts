import type { RoomSlug } from '@/data/rooms';

/** Modern WebP format for fast loads and 90%+ size reduction */
export const ASSET_EXT = 'webp';

export type Variant = 'day' | 'night';

export const roomAsset = (slug: RoomSlug, variant: Variant) =>
  `/assets/rooms/${slug}-${variant}.${ASSET_EXT}`;

export const objectAsset = (name: string) => `/assets/objects/${name}.${ASSET_EXT}`;

