import type { Gundam } from '@/types/models'

const getGundamPrimaryImage = (gundam: Gundam): string => {
  // Find primary image first
  const primaryImage = gundam.images.find((img) => img.is_primary)

  // If found, return its URL, otherwise return first image's URL
  return primaryImage ? primaryImage.url : gundam.images[0].url
}

export { getGundamPrimaryImage }
