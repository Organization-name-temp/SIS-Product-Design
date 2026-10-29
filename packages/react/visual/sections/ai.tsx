import { ChatPanel, type ChatEntry } from "../../src/ai/ChatPanel";

const messages: ChatEntry[] = [
  { id: "m1", role: "user", content: "When does registration close?" },
  {
    id: "m2",
    role: "assistant",
    content: "Registration closes on 12 October at 23:59. Seats in MATH 201 section 4 are still available.",
    citations: [
      { label: "Academic calendar", href: "https://example.test/calendar" },
      { label: "Section 4", href: "https://example.test/s4" },
    ],
  },
];
const streamingMessages: ChatEntry[] = [
  { id: "m1", role: "user", content: "Summarize my holds." },
  { id: "m2", role: "assistant", content: "You have one hold: library fine of 50 EGP." },
];

export function AiSection() {
  return (
    <div className="fixture-stack">
      <ChatPanel messages={messages} onSend={() => {}} ariaLabel="Assistant" />
      <ChatPanel messages={streamingMessages} onSend={() => {}} streaming ariaLabel="Assistant streaming" />
    </div>
  );
}
