import type { ReactNode } from "react";

const MARK = /<(\/?)(b|i|u|br)\s*\/?>/gi;

/** Render story text, including bold, italic, and underline marks. */
export function StoryText({ text }: { text: string }) {
  const root: ReactNode[] = [];
  const stack: { tag: "b" | "i" | "u"; children: ReactNode[] }[] = [];
  let last = 0;
  let key = 0;
  const current = () => (stack.length ? stack[stack.length - 1].children : root);

  function pushText(value: string) {
    if (!value) return;
    const lines = value.split("\n");
    lines.forEach((line, index) => {
      if (index > 0) current().push(<br key={`br-${key++}`} />);
      if (line) current().push(line);
    });
  }

  function wrap(tag: "b" | "i" | "u", children: ReactNode[]) {
    if (tag === "b") return <strong key={`m-${key++}`}>{children}</strong>;
    if (tag === "i") return <em key={`m-${key++}`}>{children}</em>;
    return <u key={`m-${key++}`}>{children}</u>;
  }

  for (const match of text.matchAll(MARK)) {
    const index = match.index ?? 0;
    pushText(text.slice(last, index));
    last = index + match[0].length;
    const closing = match[1] === "/";
    const tag = match[2].toLowerCase() as "b" | "i" | "u" | "br";
    if (tag === "br") {
      current().push(<br key={`br-${key++}`} />);
      continue;
    }
    if (!closing) {
      stack.push({ tag, children: [] });
      continue;
    }
    const open = stack[stack.length - 1];
    if (open && open.tag === tag) {
      stack.pop();
      current().push(wrap(tag, open.children));
    }
  }
  pushText(text.slice(last));
  while (stack.length) {
    const open = stack.pop();
    if (open) current().push(wrap(open.tag, open.children));
  }
  return <>{root}</>;
}
