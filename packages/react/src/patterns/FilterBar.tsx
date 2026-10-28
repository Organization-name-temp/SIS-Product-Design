import { useId, type ReactNode } from "react";

export interface FilterBarProps {
  searchPlaceholder?: string;
  children?: ReactNode;
}

export function FilterBar({ searchPlaceholder = "Search", children }: FilterBarProps) {
  const id = useId();
  return (
    <div className="sis-filterbar" role="search" aria-label="Filters">
      <input
        id={id}
        type="search"
        className="sis-field-input sis-filterbar-search"
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
      />
      {children}
    </div>
  );
}
