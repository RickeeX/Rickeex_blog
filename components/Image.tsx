import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH || ''

const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

const Image = ({
  src,
  loading = 'lazy',
  quality = 85,
  placeholder,
  blurDataURL,
  width,
  height,
  style,
  ...rest
}: ImageProps) => {
  const imageSrc =
    typeof src === 'string' && src.startsWith('/') && !src.startsWith(`${basePath}/`)
      ? `${basePath}${src}`
      : src

  const finalPlaceholder = placeholder ?? 'blur'
  const finalBlurDataURL = blurDataURL ?? DEFAULT_BLUR_DATA_URL

  const useFill = width === undefined && height === undefined

  return (
    <NextImage
      src={imageSrc}
      loading={loading}
      quality={quality}
      placeholder={finalPlaceholder}
      blurDataURL={finalPlaceholder === 'blur' ? finalBlurDataURL : undefined}
      fill={useFill}
      style={useFill ? { objectFit: 'cover', ...style } : style}
      width={useFill ? undefined : width}
      height={useFill ? undefined : height}
      {...rest}
    />
  )
}

export default Image
