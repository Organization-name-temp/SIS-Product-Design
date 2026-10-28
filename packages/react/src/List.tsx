import type { ReactNode } from "react";

export interface ListProps {
  items: ReactNode[];
  ordered?: boolean;
  dense?: boolean;
}

export function List({ items, ordered = false, dense = false }: ListProps) {
  const Tag = ordered ? "ol" : "ul";
  const classes = ["sis-list"];
  if (dense) classes.push("sis-list-dense");
  return (
    <Tag className={classes.join(" ")}>
      {items.map((item, index) => (
        <li key={index} className="sis-list-item">
          {item}
        </li>
      ))}
    </Tag>
  );
}
