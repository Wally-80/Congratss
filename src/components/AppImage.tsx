"use client";
import { useState } from "react";
import Image, { type ImageProps } from "next/image";

/** Static export and device-local previews use original sources and natural aspect ratios. */
export default function AppImage({
  width,
  height,
  alt,
  onLoad,
  ...props
}: ImageProps) {
  const [natural, setNatural] = useState({ width: 640, height: 640 });
  return (
    <Image
      {...props}
      alt={alt}
      width={width ?? natural.width}
      height={height ?? natural.height}
      unoptimized
      onLoad={(event) => {
        if (width === undefined && height === undefined) {
          const image = event.currentTarget;
          if (image.naturalWidth && image.naturalHeight)
            setNatural({
              width: image.naturalWidth,
              height: image.naturalHeight,
            });
        }
        onLoad?.(event);
      }}
    />
  );
}
