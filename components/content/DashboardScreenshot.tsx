import Image from "next/image";

interface DashboardScreenshotProps {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  className?: string;
}

export function DashboardScreenshot({
  src,
  alt,
  caption,
  width,
  height,
  className,
}: DashboardScreenshotProps) {
  return (
    <figure className={`mt-6 ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        sizes="(min-width: 1024px) 760px, calc(100vw - 2.5rem)"
        className="h-auto w-full rounded-card border border-border bg-surface"
      />
      <figcaption className="mt-2 text-sm leading-relaxed text-text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
