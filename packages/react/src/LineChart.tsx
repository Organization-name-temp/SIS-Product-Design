import { ChartFrame, PAD_X, PAD_Y } from "./chart-frame";
import type { ChartPoint } from "./BarChart";

export interface LineChartProps {
  data: ChartPoint[];
  ariaLabel: string;
  height?: number;
}

export function LineChart({ data, ariaLabel, height = 200 }: LineChartProps) {
  const max = Math.max(...data.map((point) => point.value), 1);
  const innerHeight = height - PAD_Y * 2;
  const innerWidth = 400 - PAD_X * 2;
  const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const points = data
    .map((point, index) => `${PAD_X + index * step},${height - PAD_Y - (point.value / max) * innerHeight}`)
    .join(" ");

  return (
    <ChartFrame data={data} ariaLabel={ariaLabel} height={height} ticks={ticks} max={max}>
      <polyline className="sis-chart-line" points={points} fill="none" strokeWidth={2} />
      {data.map((point, index) => (
        <g key={point.label}>
          <circle
            className="sis-chart-marker"
            cx={PAD_X + index * step}
            cy={height - PAD_Y - (point.value / max) * innerHeight}
            r={3}
          />
          <text className="sis-chart-axis" x={PAD_X + index * step} y={height - PAD_Y + 16} textAnchor="middle">
            {point.label}
          </text>
        </g>
      ))}
    </ChartFrame>
  );
}
