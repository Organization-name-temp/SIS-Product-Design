export interface CitationChipProps {
  label: string;
  href: string;
}

export function CitationChip({ label, href }: CitationChipProps) {
  return (
    <a
      className="sis-citation"
      href={href}
      target={
        href.startsWith("#") || href.startsWith("/") ? undefined : "_blank"
      }
      rel="noreferrer"
    >
      {label}
    </a>
  );
}
