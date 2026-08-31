import type { ReactNode } from "react";

/**
 * A hand-rolled, minimal "syntax highlighter" for the few short SQL/TS
 * snippets on /engineering — not a real tokenizer/library (unnecessary
 * bundle weight for three ~3-line snippets). Colors keywords and string
 * literals using the site's own terracotta/sage palette instead of a
 * generic dark-theme code-editor look, so the code card matches the rest
 * of the site rather than looking like a bolted-on widget.
 */
const STRING_PATTERN = /"[^"]*"/g;
// Non-capturing group (?:...) is deliberate: String.prototype.split() on a
// regex with a *capturing* group inserts the captured text into the
// result array (a well-known JS gotcha) — combined with the explicit
// matches[i] push below, that duplicated every keyword ("createcreate").
const KEYWORD_PATTERN =
  /\b(?:create|policy|on|for|select|using|await|from|upsert|onConflict|if|status|event|system|channel)\b/g;

function highlightKeywords(text: string, keyPrefix: string): ReactNode {
  const parts = text.split(KEYWORD_PATTERN);
  const matches = text.match(KEYWORD_PATTERN) ?? [];
  if (matches.length === 0) return text;

  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) nodes.push(part);
    if (matches[i]) {
      nodes.push(
        <span key={`${keyPrefix}-k${i}`} className="text-terracotta">
          {matches[i]}
        </span>,
      );
    }
  });
  return nodes;
}

export function highlightCode(code: string): ReactNode {
  return code.split("\n").map((line, li) => {
    const stringParts = line.split(STRING_PATTERN);
    const stringMatches = line.match(STRING_PATTERN) ?? [];

    const lineNodes: ReactNode[] = [];
    stringParts.forEach((part, i) => {
      if (part) {
        lineNodes.push(
          <span key={`l${li}-t${i}`}>{highlightKeywords(part, `l${li}-${i}`)}</span>,
        );
      }
      if (stringMatches[i]) {
        lineNodes.push(
          <span key={`l${li}-s${i}`} className="text-sage-dark">
            {stringMatches[i]}
          </span>,
        );
      }
    });

    return (
      <div key={li} className="whitespace-pre">
        {lineNodes.length ? lineNodes : " "}
      </div>
    );
  });
}
