export interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <span className="sis-spinner" role="status" style={{ inlineSize: size, blockSize: size }}>
      <span className="sis-spinner-circle" aria-hidden="true" />
      <span className="sis-visually-hidden">Loading</span>
    </span>
  );
}
