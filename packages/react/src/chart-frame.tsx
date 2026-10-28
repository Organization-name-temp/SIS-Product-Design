import type { ReactNode } from "react";
import type { ChartPoint } from "./BarChart";

export const PAD_X = 44;
export const PAD_Y = 28;

export interface ChartFrameProps {
  data: ChartPoint[];
  ariaLabel: string;
  height: number;
  ticks: number[];
  max: number;
  children: ReactNode;
}

export function ChartFrame({ data, ariaLabel, height, ticks, max, children }: ChartFrameProps) {
  const innerHeight = height - PAD_Y * 2;
  return (
    <svg
      className="sis-chart"
      viewBox={`0 0 400 ${height}`}
      role="img"
      aria-label={ariaLabel}
      style={{ inlineSize: "100%", blockSize: "auto" }}
    >
      {ticks.map((tick) => {
        const y = height - PAD_Y - (tick / max) * innerHeight;
        return (
          <g key={tick}>
            <line className="sis-chart-grid" x1={PAD_X} x2={400 - PAD_X / 2} y1={y} y2={y} />
            <text className="sis-chart-tick" x={PAD_X - 8} y={y + 4} textAnchor="end">
              {tick}
            </text>
          </g>
        );
      })}
      {children}
    </svg>
  );
}
