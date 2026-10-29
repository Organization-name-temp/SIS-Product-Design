import { useId, type ReactNode } from "react";

export interface FilterBarProps {
  searchPlaceholder?: string;
  children?: ReactNode;
  value?: string;
  onSearchChange?: (value: string) => void;
}

export function FilterBar({
  searchPlaceholder = "Search",
  children,
  value,
  onSearchChange,
}: FilterBarProps) {
  const id = useId();
  return (
    <div className="sis-filterbar" role="search" aria-label="Filters">
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onSearchChange?.(event.target.value)}
        className="sis-field-input sis-filterbar-search"
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
      />
      {children}
    </div>
  );
}
