import { useState } from "react";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 24 | 32 | 40;
}

export function Avatar({ name, src, size = 32 }: AvatarProps) {
  const [failedSource, setFailedSource] = useState<string>();
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className="sis-avatar"
      style={{
        inlineSize: size,
        blockSize: size,
        fontSize: Math.round(size * 0.38),
      }}
      title={name}
    >
      {src && failedSource !== src ? (
        <img
          className="sis-avatar-img"
          src={src}
          alt=""
          onError={() => setFailedSource(src)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
      <span className="sis-visually-hidden">{name}</span>
    </span>
  );
}
