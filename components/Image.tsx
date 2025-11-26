import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

// 默认的模糊占位符（1x1 像素的灰色图片）
const DEFAULT_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

const Image = ({
  src,
  loading = 'lazy',
  quality = 85,
  placeholder,
  blurDataURL,
  ...rest
}: ImageProps) => {
  // 处理 basePath
  const imageSrc = typeof src === 'string' ? `${basePath || ''}${src}` : src

  // 如果用户没有提供 placeholder 或 blurDataURL，使用默认值
  const finalPlaceholder = placeholder ?? 'blur'
  const finalBlurDataURL = blurDataURL ?? DEFAULT_BLUR_DATA_URL

  return (
    <NextImage
      src={imageSrc}
      loading={loading}
      quality={quality}
      placeholder={finalPlaceholder}
      blurDataURL={finalPlaceholder === 'blur' ? finalBlurDataURL : undefined}
      {...rest}
    />
  )
}

export default Image
