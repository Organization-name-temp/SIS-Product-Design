export interface CitationChipProps {
  label: string;
  href: string;
}

export function CitationChip({ label, href }: CitationChipProps) {
  return (
    <a className="sis-citation" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
