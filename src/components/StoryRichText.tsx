"use client";

import { useEffect, useRef } from "react";

const ALLOWED = /<\/?(?:b|i|u|br)\s*\/?>/i;

export function storyLooksFormatted(value: string) {
  return ALLOWED.test(value);
}

/** Keep bold, italic, underline, and line breaks. Drop everything else. */
export function sanitizeStoryHtml(html: string): string {
  if (typeof document === "undefined") return html;
  const parsed = new DOMParser().parseFromString(html, "text/html");

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = (node as Element).tagName.toLowerCase();
    const inner = Array.from(node.childNodes).map(walk).join("");
    if (tag === "b" || tag === "strong") return `<b>${inner}</b>`;
    if (tag === "i" || tag === "em") return `<i>${inner}</i>`;
    if (tag === "u") return `<u>${inner}</u>`;
    if (tag === "br") return "<br>";
    if (tag === "div" || tag === "p" || tag === "li") return `${inner}<br>`;
    return inner;
  }

  return Array.from(parsed.body.childNodes)
    .map(walk)
    .join("")
    .replace(/(?:<br>)+$/g, "");
}

export function StoryRichText({
  value,
  placeholder,
  labelledBy,
  active,
  onFocus,
  onChange,
  editorRef,
}: {
  value: string;
  placeholder?: string;
  labelledBy?: string;
  active: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  editorRef: (node: HTMLDivElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const written = useRef(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (document.activeElement === node && written.current === value) return;
    if (written.current === value && node.innerHTML) return;
    if (storyLooksFormatted(value)) node.innerHTML = value;
    else node.textContent = value;
    written.current = value;
  }, [value]);

  return (
    <div
      ref={(node) => {
        ref.current = node;
        if (active) editorRef(node);
      }}
      className="studio-body studio-rich"
      contentEditable
      role="textbox"
      aria-multiline="true"
      aria-labelledby={labelledBy}
      data-placeholder={placeholder || ""}
      suppressContentEditableWarning
      onFocus={onFocus}
      onInput={() => {
        const node = ref.current;
        if (!node) return;
        const next = sanitizeStoryHtml(node.innerHTML);
        written.current = next;
        onChange(next);
      }}
    />
  );
}
