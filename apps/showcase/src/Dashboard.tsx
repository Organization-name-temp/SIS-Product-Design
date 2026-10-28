import { useState } from "react";
import { Badge, Button } from "sis-react";
import { previewDate } from "./data";
import { Icon, type IconName } from "./Icon";

const weekly = [
  450, 720, 690, 1200, 1540, 1800, 2150, 2840, 3100, 3410, 3800, 4200,
];
const monthly = [
  6100, 6900, 7400, 7200, 8200, 9400, 9000, 10400, 11200, 11000, 12000, 12480,
];

export function DashboardMetrics() {
  const metrics: {
    label: string;
    value: string;
    change: string;
    description: string;
    icon: IconName;
    points: string;
  }[] = [
    {
      label: "Total enrolled",
      value: "12,480",
      change: "+4.2%",
      description: "vs. last semester",
      icon: "students",
      points: "0,33 12,30 24,32 36,21 48,24 60,18 72,20 84,8 96,11 110,2",
    },
    {
      label: "Registration rate",
      value: "94.1%",
      change: "+0.8%",
      description: "vs. last semester",
      icon: "check",
      points: "0,33 12,31 24,24 36,27 48,17 60,20 72,10 84,13 96,5 110,2",
    },
    {
      label: "Pending approvals",
      value: "186",
      change: "32 reviewed",
      description: "this week",
      icon: "clock",
      points: "0,5 12,10 24,8 36,17 48,14 60,20 72,18 84,27 96,25 110,34",
    },
    {
      label: "Active courses",
      value: "248",
      change: "+12 courses",
      description: "this semester",
      icon: "courses",
      points: "0,32 12,32 24,24 36,24 48,24 60,17 72,17 84,10 96,10 110,2",
    },
  ];
  return (
    <div className="sis-metrics">
      {metrics.map((metric) => (
        <section
          className="sis-metric sis-panel"
          key={metric.label}
          aria-label={`${metric.label}: ${metric.value}`}
        >
          <div className="sis-metric-label">
            <span>{metric.label}</span>
            <Icon name={metric.icon} />
          </div>
          <div className="sis-metric-value">
            <strong>{metric.value}</strong>
            <svg viewBox="0 0 112 40" fill="none" aria-hidden="true">
              <polyline
                points={metric.points}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="sis-metric-change">
            <span>{metric.change}</span>
            <small>{metric.description}</small>
          </div>
        </section>
      ))}
    </div>
  );
}

export function DashboardCharts({
  closes,
  reviewHolds,
  openSettings,
}: {
  closes: string;
  reviewHolds: () => void;
  openSettings: () => void;
}) {
  const deadline = new Date(`${closes}T00:00:00Z`);
  const closeLabel = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const daysLeft = Math.ceil(
    (deadline.getTime() - new Date(`${previewDate}T00:00:00Z`).getTime()) /
      86400000,
  );
  const [period, setPeriod] = useState("semester");
  const values = period === "semester" ? monthly : weekly;
  const max = period === "semester" ? 15000 : 5000;
  const coords = values.map((value, index) => [
    52 + index * 49,
    190 - (value / max) * 160,
  ]);
  const line = coords
    .map((point, index) => `${index ? "L" : "M"}${point.join(",")}`)
    .join(" ");
  const labels =
    period === "semester"
      ? ["Aug 24", "Sep 07", "Sep 21", "Oct 05", "Oct 19", "Oct 28"]
      : ["Oct 21", "Oct 22", "Oct 24", "Oct 25", "Oct 27", "Oct 28"];
  return (
    <div className="sis-analytics">
      <section className="sis-panel sis-enrollment">
        <div className="sis-panel-heading">
          <div>
            <h2>Enrollment overview</h2>
            <p>Student registrations over time</p>
          </div>
          <div
            className="sis-segment"
            role="group"
            aria-label="Enrollment period"
          >
            <button
              type="button"
              aria-pressed={period === "week"}
              onClick={() => setPeriod("week")}
            >
              This week
            </button>
            <button
              type="button"
              aria-pressed={period === "semester"}
              onClick={() => setPeriod("semester")}
            >
              This semester
            </button>
          </div>
        </div>
        <div className="sis-chart-summary">
          <strong>{period === "semester" ? "12,480" : "4,200"}</strong>
          <span className="sis-positive">
            <Icon name="trend" />
            {period === "semester" ? "+4.2%" : "+8.6%"}
          </span>
          <span>students registered</span>
        </div>
        <figure className="sis-enrollment-chart">
          <svg
            viewBox="0 0 630 225"
            role="img"
            aria-labelledby="enrollment-title enrollment-desc"
          >
            <title id="enrollment-title">
              {period === "semester"
                ? "Semester enrollment"
                : "Weekly enrollment"}
            </title>
            <desc id="enrollment-desc">
              {period === "semester"
                ? "Enrollment rises from 6,100 in August to 12,480 on October 28."
                : "Weekly registrations rise from 450 to 4,200."}{" "}
              Sample data.
            </desc>
            <defs>
              <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--sys-color-action-primary-bg)"
                  stopOpacity=".13"
                />
                <stop
                  offset="100%"
                  stopColor="var(--sys-color-action-primary-bg)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((tick) => (
              <g key={tick}>
                <line
                  x1="52"
                  x2="600"
                  y1={30 + tick * 53.33}
                  y2={30 + tick * 53.33}
                  className="sis-chart-grid"
                />
                <text x="0" y={35 + tick * 53.33}>
                  {((max - (tick * max) / 3) / 1000).toFixed(0)}k
                </text>
              </g>
            ))}
            <path d={`${line} L591,190 L52,190 Z`} fill="url(#chart-fill)" />
            <path
              d={coords
                .map(([x, y], index) => `${index ? "L" : "M"}${x},${y + 14}`)
                .join(" ")}
              className="sis-chart-previous"
            />
            <path d={line} className="sis-chart-line" />
            {coords.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" className="sis-chart-point">
                <title>{values[i].toLocaleString("en-US")} registrations</title>
              </circle>
            ))}
            {labels.map((label, i) => (
              <text
                key={label}
                className={`sis-chart-date sis-chart-date-${i}`}
                x={52 + i * 108}
                y="220"
                textAnchor={i === 5 ? "end" : "start"}
              >
                {label}
              </text>
            ))}
          </svg>
          <figcaption>
            <span className="sis-chart-legend" />
            Fall 2026
            <span className="sis-chart-legend sis-chart-legend-muted" />
            Previous semester{" "}
          </figcaption>
        </figure>
      </section>
      <section className="sis-panel sis-status-panel">
        <div className="sis-panel-heading">
          <div>
            <h2>Registration status</h2>
            <p>Fall 2026 semester</p>
          </div>
          <Badge>Live preview</Badge>
        </div>
        <div className="sis-status-summary">
          <svg
            className="sis-donut"
            viewBox="0 0 120 120"
            role="img"
            aria-label="94.1 percent registration completion"
          >
            <circle cx="60" cy="60" r="48" className="sis-donut-track" />
            <circle
              cx="60"
              cy="60"
              r="48"
              className="sis-donut-fill"
              strokeDasharray="283.8 301.6"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              className="sis-donut-pending"
              strokeDasharray="10 301.6"
              strokeDashoffset="-286"
            />
            <text x="60" y="58" textAnchor="middle" className="sis-donut-value">
              94.1%
            </text>
            <text x="60" y="77" textAnchor="middle">
              Complete
            </text>
          </svg>
          <div className="sis-status-legend">
            <div>
              <span className="sis-status-dot" />
              <span>Registered</span>
              <strong>12,480</strong>
            </div>
            <div>
              <span className="sis-status-dot sis-pending-dot" />
              <span>Pending</span>
              <strong>186</strong>
            </div>
            <button
              type="button"
              aria-label="Review held registrations"
              onClick={reviewHolds}
            >
              <span className="sis-status-dot sis-hold-dot" />
              <span>On hold</span>
              <strong>596</strong>
              <Icon name="chevron" />
            </button>
          </div>
        </div>
        <div className="sis-deadline">
          <span className="sis-deadline-icon">
            <Icon name="calendar" />
          </span>
          <div>
            <strong>Registration closes {closeLabel}</strong>
            <p>
              {daysLeft > 0
                ? `${daysLeft} days left in the registration window.`
                : daysLeft === 0
                  ? "Registration closes today."
                  : "The registration window has closed."}
            </p>
          </div>
          <button
            className="sis-icon-button"
            aria-label="View registration settings"
            onClick={openSettings}
          >
            <Icon name="arrow" />
          </button>
        </div>
      </section>
    </div>
  );
}
