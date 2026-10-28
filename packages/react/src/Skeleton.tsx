export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ width, height = 12, lines }: SkeletonProps) {
  if (lines) {
    return (
      <div className="sis-skeleton-group">
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className="sis-skeleton"
            aria-hidden="true"
            style={{ inlineSize: index === lines - 1 ? "60%" : "100%", blockSize: height }}
          />
        ))}
      </div>
    );
  }
  return <span className="sis-skeleton" aria-hidden="true" style={{ inlineSize: width ?? "100%", blockSize: height }} />;
}
