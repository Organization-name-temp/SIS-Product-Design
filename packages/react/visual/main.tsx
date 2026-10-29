import "sis-tokens/css";
import "../src/styles/sis-react.css";
import "./fixture.css";
import { CoreSection } from "./sections/core";
import { createRoot } from "react-dom/client";
import { ContainersSection } from "./sections/containers";
import { FeedbackSection } from "./sections/feedback";
import { InputsSection } from "./sections/inputs";
import { ChartsSection } from "./sections/charts";
import { PatternsSection } from "./sections/patterns";
import { AiSection } from "./sections/ai";
import { OverlaysSection } from "./sections/overlays";

const params = new URLSearchParams(window.location.search);
const theme = params.get("theme") ?? "light";
const dir = params.get("dir") ?? "ltr";
const density = params.get("density") ?? "comfortable";
const overlay = params.get("overlay") === "1";
document.documentElement.setAttribute("data-theme", theme);
document.documentElement.setAttribute("dir", dir);
document.documentElement.setAttribute("data-density", density);
document.documentElement.setAttribute("lang", "en");

function LibraryFixture() {
  const sections = [
    ["Actions and controls", CoreSection],
    ["Containers and navigation", ContainersSection],
    ["Feedback and tables", FeedbackSection],
    ["Files and inputs", InputsSection],
    ["Charts", ChartsSection],
    ["Page patterns", PatternsSection],
    ["Assistant", AiSection],
  ] as const;
  return (
    <main className="fixture-main">
      <h1>SIS component library</h1>
      {sections.map(([title, Section]) => (
        <section
          className="fixture-section"
          key={title}
          aria-label={`${title} specimens`}
        >
          <h2>{title}</h2>
          <Section />
        </section>
      ))}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  overlay ? <OverlaysSection /> : <LibraryFixture />,
);
