import { useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  label: string;
}

export function Tabs({ tabs, label }: TabsProps) {
  const [active, setActive] = useState(tabs[0]?.id);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const tabButtons = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]") ?? []);
    const index = tabButtons.indexOf(event.currentTarget);
    const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : undefined;
    const next =
      offset === undefined
        ? event.key === "Home"
          ? 0
          : tabButtons.length - 1
        : (index + offset + tabButtons.length) % tabButtons.length;
    const target = tabButtons[next];
    if (target) setActive(tabs[next].id);
    target?.focus();
  };

  const activeTab = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className="sis-tabs">
      <div className="sis-tabs-list" role="tablist" aria-label={label}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            data-tab-id={tab.id}
            id={`sis-tab-${tab.id}`}
            className="sis-tab"
            aria-selected={tab.id === activeTab?.id}
            aria-controls={`sis-tabpanel-${tab.id}`}
            tabIndex={tab.id === activeTab?.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="sis-tabpanel"
        role="tabpanel"
        id={`sis-tabpanel-${activeTab?.id}`}
        aria-labelledby={`sis-tab-${activeTab?.id}`}
      >
        {activeTab?.content}
      </div>
    </div>
  );
}
