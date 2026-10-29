import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { BarChart } from "../src/BarChart";
import { LineChart } from "../src/LineChart";

const data = [
  { label: "2018", value: 120 },
  { label: "2019", value: 160 },
  { label: "2020", value: 90 },
  { label: "2021", value: 210 },
  { label: "2022", value: 180 },
];

describe("BarChart", () => {
  it("describes the actual values and renders an empty state", () => {
    const view = render(<BarChart data={data} ariaLabel="Enrollment" />);
    expect(
      screen.getByRole("img", { name: "Enrollment" }),
    ).toHaveAccessibleDescription(/2018: 120/);
    view.rerender(<BarChart data={[]} ariaLabel="Enrollment" />);
    expect(
      screen.getByText("No data yet", { selector: "text" }),
    ).toBeInTheDocument();
  });
  it("renders one bar per data point with an accessible label", () => {
    render(<BarChart data={data} ariaLabel="Enrollment by year" />);
    const chart = screen.getByRole("img", { name: "Enrollment by year" });
    expect(chart.querySelectorAll("rect")).toHaveLength(5);
  });

  it("passes axe", async () => {
    const { container } = render(
      <BarChart data={data} ariaLabel="Enrollment by year" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("LineChart", () => {
  it("renders a single line with markers", () => {
    render(<LineChart data={data} ariaLabel="Enrollment trend" />);
    const chart = screen.getByRole("img", { name: "Enrollment trend" });
    expect(chart.querySelectorAll("polyline")).toHaveLength(1);
    expect(chart.querySelectorAll("circle")).toHaveLength(5);
  });

  it("passes axe", async () => {
    const { container } = render(
      <LineChart data={data} ariaLabel="Enrollment trend" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
