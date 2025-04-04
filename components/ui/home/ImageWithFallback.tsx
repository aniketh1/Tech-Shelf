'use client';

import Image from 'next/image';
import { useState, useEffect, memo } from 'react';

type ImageWithFallbackProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  quality?: number;
};

function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
  fill,
  sizes,
  priority,
  width,
  height,
  loading = "lazy",
  quality = 75,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  return (
    <Image
      src={error && fallbackSrc ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={priority}
      width={width}
      height={height}
      loading={loading}
      quality={quality}
      onError={() => {
        setError(true);
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

export default memo(ImageWithFallback);