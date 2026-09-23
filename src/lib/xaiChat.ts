/** Server-side Grok calls. Key stays in XAI_API_KEY and never reaches the browser. */

function messageText(json: Record<string, unknown>): string {
  const choices = json.choices as
    | { message?: { content?: unknown } }[]
    | undefined;
  const content = choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) return content;
  if (Array.isArray(content)) {
    const joined = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object") {
          const p = part as { text?: string; content?: string };
          return p.text || p.content || "";
        }
        return "";
      })
      .join("");
    if (joined.trim()) return joined;
  }
  if (typeof json.output_text === "string" && json.output_text.trim()) {
    return json.output_text;
  }
  return "";
}

export function parseJsonObject<T>(raw: string): T | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

export function xaiConfigured() {
  return Boolean(process.env.XAI_API_KEY?.trim());
}

/** Ask Grok for one JSON object. Tries the current model, then the previous two. */
export async function grokJson<T>(system: string, user: string): Promise<T> {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) throw new Error("XAI_API_KEY is not set on this server");

  const models = ["grok-4.7", "grok-4.6", "grok-4.5"];
  let lastError = "Grok did not answer";
  for (const model of models) {
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user.slice(0, 14000) },
          ],
        }),
        signal: AbortSignal.timeout(55_000),
      });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
        error?: { message?: string } | string;
      };
      if (!res.ok) {
        const errMsg =
          typeof json.error === "string"
            ? json.error
            : json.error?.message || `xAI ${res.status}`;
        lastError = `${model}: ${errMsg}`.slice(0, 200);
        continue;
      }
      const parsed = parseJsonObject<T>(messageText(json));
      if (parsed) return parsed;
      lastError = `${model}: reply was not JSON`;
    } catch (err) {
      lastError =
        err instanceof Error && err.name === "TimeoutError"
          ? `${model}: timed out`
          : `${model}: ${err instanceof Error ? err.message : "network error"}`;
    }
  }
  throw new Error(lastError);
}
