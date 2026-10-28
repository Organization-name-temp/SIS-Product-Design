import type { ReactNode } from "react";
import { CitationChip } from "./CitationChip";

export interface ChatCitation {
  label: string;
  href: string;
}

export interface ChatMessageProps {
  role: "user" | "assistant";
  children: ReactNode;
  streaming?: boolean;
  citations?: ChatCitation[];
}

export function ChatMessage({ role, children, streaming = false, citations }: ChatMessageProps) {
  return (
    <div className={`sis-chat-message sis-chat-${role}`} aria-busy={streaming || undefined}>
      <div className="sis-chat-bubble">
        {children}
        {streaming ? <span className="sis-chat-cursor" aria-hidden="true" /> : null}
      </div>
      {citations?.length ? (
        <div className="sis-chat-citations">
          {citations.map((citation) => (
            <CitationChip key={citation.href} label={citation.label} href={citation.href} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
