import { ChartFrame, PAD_X, PAD_Y } from "./chart-frame";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: ChartPoint[];
  ariaLabel: string;
  height?: number;
}

export function BarChart({ data, ariaLabel, height = 200 }: BarChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const innerHeight = height - PAD_Y * 2;
  const innerWidth = 400 - PAD_X * 2;
  const band = innerWidth / data.length;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const barWidth = Math.min(36, band * 0.6);

  return (
    <ChartFrame data={data} ariaLabel={ariaLabel} height={height} ticks={ticks} max={max}>
      {data.map((point, index) => {
        const barHeight = (point.value / max) * innerHeight;
        return (
          <g key={point.label}>
            <rect
              className="sis-chart-bar"
              x={PAD_X + index * band + (band - barWidth) / 2}
              y={height - PAD_Y - barHeight}
              width={barWidth}
              height={barHeight}
              rx={4}
            />
            <text
              className="sis-chart-value"
              x={PAD_X + index * band + band / 2}
              y={height - PAD_Y - barHeight - 6}
              textAnchor="middle"
            >
              {point.value}
            </text>
            <text className="sis-chart-axis" x={PAD_X + index * band + band / 2} y={height - PAD_Y + 16} textAnchor="middle">
              {point.label}
            </text>
          </g>
        );
      })}
    </ChartFrame>
  );
}
