const DANGEROUS_TAGS = /<(script|iframe|object|embed|form|base|link|meta|style)\b[^>]*>[\s\S]*?<\/\1>/gi
const VOID_DANGEROUS = /<(script|iframe|object|embed|form|base|link|meta|style)\b[^>]*\/?>/gi
const EVENT_ATTRS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const JS_HREF = /\s+(?:href|src|action|formaction|data)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi
const DATA_URI = /\s+(?:href|src|action|formaction)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi

export function sanitizeHtml(html: string): string {
  return html
    .replace(DANGEROUS_TAGS, '')
    .replace(VOID_DANGEROUS, '')
    .replace(EVENT_ATTRS, '')
    .replace(JS_HREF, '')
    .replace(DATA_URI, '')
}
