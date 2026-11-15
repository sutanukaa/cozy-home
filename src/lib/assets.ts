import type { RoomSlug } from '@/data/rooms';

/** Change this one constant if you export your art as .webp / .jpg instead. */
export const ASSET_EXT = 'png';

export type Variant = 'day' | 'night';

export const roomAsset = (slug: RoomSlug, variant: Variant) =>
  `/assets/rooms/${slug}-${variant}.${ASSET_EXT}`;

export const objectAsset = (name: string) => `/assets/objects/${name}.${ASSET_EXT}`;
