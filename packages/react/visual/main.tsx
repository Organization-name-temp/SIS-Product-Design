import type { CSSProperties } from "react";
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
document.documentElement.setAttribute("lang", dir === "rtl" ? "ar" : "en");

const grid: CSSProperties = { display: "grid", gap: 24, padding: 24, maxWidth: 470 };

function LibraryFixture() {
  return (
    <div style={grid}>
      <ContainersSection />
      <FeedbackSection />
      <InputsSection />
      <ChartsSection />
      <PatternsSection />
      <AiSection />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  overlay ? <OverlaysSection /> : <LibraryFixture />,
);
