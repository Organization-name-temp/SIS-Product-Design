import { Skeleton } from "../Skeleton";

export interface LoadingStateProps {
  rows?: number;
}

export function LoadingState({ rows = 4 }: LoadingStateProps) {
  return (
    <div className="sis-state" role="status" aria-busy="true">
      <Skeleton height={20} width="40%" />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} height={14} />
      ))}
    </div>
  );
}
