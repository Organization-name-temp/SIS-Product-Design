import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ChatMessage } from "../src/ai/ChatMessage";
import { CitationChip } from "../src/ai/CitationChip";
import { ChatPanel, type ChatEntry } from "../src/ai/ChatPanel";

describe("CitationChip", () => {
  it("renders an external link", () => {
    render(<CitationChip label="Regulation 12" href="https://example.test/reg" />);
    const link = screen.getByRole("link", { name: "Regulation 12" });
    expect(link).toHaveAttribute("target", "_blank");
  });
});

describe("ChatMessage", () => {
  it("marks streaming messages busy", () => {
    render(
      <ChatMessage role="assistant" streaming>
        Working on it
      </ChatMessage>,
    );
    expect(screen.getByText("Working on it").parentElement).toHaveAttribute("aria-busy", "true");
  });

  it("renders citations", () => {
    render(
      <ChatMessage role="assistant" citations={[{ label: "Policy 4", href: "https://example.test/4" }]}>
        The deadline applies.
      </ChatMessage>,
    );
    expect(screen.getByRole("link", { name: "Policy 4" })).toBeInTheDocument();
  });

  it("passes axe", async () => {
    const { container } = render(
      <ChatMessage role="assistant" citations={[{ label: "Policy 4", href: "https://example.test/4" }]}>
        The deadline applies.
      </ChatMessage>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ChatPanel", () => {
  const messages: ChatEntry[] = [
    { id: "m1", role: "user", content: "When does registration close?" },
    { id: "m2", role: "assistant", content: "It closes on 12 October." },
  ];

  it("renders a polite log and sends on Enter", async () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={messages} onSend={onSend} />);
    expect(screen.getByRole("log")).toHaveAttribute("aria-live", "polite");
    const input = screen.getByLabelText("Message");
    await userEvent.type(input, "Thanks{Enter}");
    expect(onSend).toHaveBeenCalledWith("Thanks");
  });

  it("keeps newlines with Shift+Enter", async () => {
    const onSend = vi.fn();
    render(<ChatPanel messages={messages} onSend={onSend} />);
    const input = screen.getByLabelText("Message");
    await userEvent.type(input, "Line one{Shift>}{Enter}{/Shift}Line two{Enter}");
    expect(onSend).toHaveBeenCalledWith("Line one\nLine two");
  });

  it("disables sending while streaming", () => {
    render(<ChatPanel messages={messages} onSend={() => {}} streaming />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("passes axe", async () => {
    const { container } = render(<ChatPanel messages={messages} onSend={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
