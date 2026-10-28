import { useId, useState, type KeyboardEvent } from "react";
import { Button } from "../Button";
import { ChatMessage } from "./ChatMessage";

export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { label: string; href: string }[];
}

export interface ChatPanelProps {
  messages: ChatEntry[];
  onSend: (message: string) => void;
  streaming?: boolean;
  ariaLabel?: string;
}

export function ChatPanel({ messages, onSend, streaming = false, ariaLabel = "Assistant" }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  const send = () => {
    const trimmed = draft.trim();
    if (!trimmed || streaming) return;
    onSend(trimmed);
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    send();
  };

  return (
    <section className="sis-chat" aria-label={ariaLabel}>
      <div className="sis-chat-log" role="log" aria-live="polite">
        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} citations={message.citations} streaming={streaming && message.id === messages[messages.length - 1]?.id && message.role === "assistant"}>
            {message.content}
          </ChatMessage>
        ))}
      </div>
      <div className="sis-chat-inputrow">
        <textarea
          id={inputId}
          rows={1}
          className="sis-field-input sis-chat-input"
          placeholder={`Message ${ariaLabel.toLowerCase()}`}
          aria-label="Message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          disabled={streaming}
        />
        <Button onClick={send} disabled={streaming || draft.trim().length === 0}>
          Send
        </Button>
      </div>
    </section>
  );
}
