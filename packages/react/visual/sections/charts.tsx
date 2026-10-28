import { BarChart } from "../../src/BarChart";
import { LineChart } from "../../src/LineChart";

const enrollment = [
  { label: "2018", value: 120 },
  { label: "2019", value: 160 },
  { label: "2020", value: 90 },
  { label: "2021", value: 210 },
  { label: "2022", value: 180 },
];

export function ChartsSection() {
  return (
    <div style={{ display: "grid", gap: 16, padding: 24, maxWidth: 430 }}>
      <BarChart data={enrollment} ariaLabel="Enrollment by year" />
      <LineChart data={enrollment} ariaLabel="Enrollment trend" />
    </div>
  );
}
