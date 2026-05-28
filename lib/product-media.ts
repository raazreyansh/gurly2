export const FALLBACK_PRODUCT_IMAGE = '/images/models/community_2.png'

export type ProductMediaType = 'image' | 'video' | 'pdf' | 'zip'

export interface ProductMediaItem {
  type: ProductMediaType
  url: string
}

const VALID_MEDIA_TYPES = new Set<ProductMediaType>(['image', 'video', 'pdf', 'zip'])

function isUsableUrl(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function normalizeType(value: unknown): ProductMediaType {
  return typeof value === 'string' && VALID_MEDIA_TYPES.has(value as ProductMediaType)
    ? (value as ProductMediaType)
    : 'image'
}

export function normalizeProductMedia(media: unknown): ProductMediaItem[] {
  if (!Array.isArray(media)) return []

  return media
    .map((item): ProductMediaItem | null => {
      if (isUsableUrl(item)) {
        return { type: 'image', url: item.trim() }
      }

      if (item && typeof item === 'object' && isUsableUrl((item as { url?: unknown }).url)) {
        return {
          type: normalizeType((item as { type?: unknown }).type),
          url: ((item as { url: string }).url).trim(),
        }
      }

      return null
    })
    .filter((item): item is ProductMediaItem => Boolean(item))
}

export function getPrimaryProductImage(media: unknown): string {
  return normalizeProductMedia(media)[0]?.url || FALLBACK_PRODUCT_IMAGE
}
