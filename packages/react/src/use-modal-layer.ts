import { useEffect, useRef, type RefObject } from "react";

const layers: HTMLElement[] = [];
const backgrounds = new Map<HTMLElement, string | null>();
let previousOverflow = "";
let initialFocus: HTMLElement | null = null;
const focusableSelector =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function synchronizeLayers() {
  const top = layers.at(-1);
  if (!top) {
    backgrounds.forEach((inert, node) =>
      inert === null
        ? node.removeAttribute("inert")
        : node.setAttribute("inert", inert),
    );
    backgrounds.clear();
    document.body.style.overflow = previousOverflow;
    return;
  }
  for (const node of Array.from(document.body.children)) {
    if (!(node instanceof HTMLElement)) continue;
    if (!backgrounds.has(node))
      backgrounds.set(node, node.getAttribute("inert"));
    if (node.contains(top)) node.removeAttribute("inert");
    else node.setAttribute("inert", "");
  }
  document.body.style.overflow = "hidden";
}

export function useModalLayer(
  open: boolean,
  panelRef: RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const restore = document.activeElement as HTMLElement | null;
    if (!layers.length) {
      previousOverflow = document.body.style.overflow;
      initialFocus = restore;
    }
    layers.push(panel);
    synchronizeLayers();
    const controls = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (node) => !node.closest("[hidden],[inert]"),
      );
    const initial = controls();
    (
      initial.find((node) =>
        node.matches("[autofocus],input,textarea,select"),
      ) ??
      initial[0] ??
      panel
    ).focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (layers.at(-1) !== panel) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const items = controls();
      if (!items.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = items[0];
      const last = items.at(-1)!;
      const outside = !panel.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || outside)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      const index = layers.indexOf(panel);
      if (index >= 0) layers.splice(index, 1);
      synchronizeLayers();
      const target =
        restore?.isConnected && !restore.closest("[inert]")
          ? restore
          : !layers.length
            ? initialFocus
            : null;
      if (target?.isConnected && !target.closest("[inert]")) target.focus();
      if (!layers.length) initialFocus = null;
    };
  }, [open, panelRef]);
}
