const SIZES = { 24: 24, 32: 32, 40: 40 } as const;

export interface AvatarProps {
  name: string;
  src?: string;
  size?: keyof typeof SIZES;
}

export function Avatar({ name, src, size = 32 }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className="sis-avatar"
      style={{ inlineSize: size, blockSize: size, fontSize: Math.round(size * 0.38) }}
      title={name}
    >
      {src ? <img className="sis-avatar-img" src={src} alt="" /> : <span aria-hidden="true">{initials}</span>}
      <span className="sis-visually-hidden">{name}</span>
    </span>
  );
}
