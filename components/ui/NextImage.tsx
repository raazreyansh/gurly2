import Image, { ImageProps } from 'next/image'

type Props = ImageProps & {
  fill?: boolean
  aspectClass?: string
}

export function NextImage({ fill, aspectClass = '', className = '', alt, ...props }: Props) {
  if (fill) {
    return (
      <div className={`relative w-full ${aspectClass} overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image {...(props as ImageProps)} alt={alt ?? ''} fill className={`object-cover`} />
      </div>
    )
  }

  return (
    <Image {...(props as ImageProps)} alt={alt ?? ''} className={`object-cover ${className}`} />
  )
}

export default NextImage
