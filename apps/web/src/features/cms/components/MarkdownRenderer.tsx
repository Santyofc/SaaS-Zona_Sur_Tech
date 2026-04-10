/**
 * MarkdownRenderer — Server Component
 *
 * Safe markdown-to-HTML renderer using remark + remark-html.
 * Replaces the dangerous inline regex renderer that was in blog/[slug].
 *
 * Does NOT use dangerouslySetInnerHTML with raw user input.
 * Instead, it processes markdown through a proper AST parser.
 */
import { remark } from "remark";
import remarkHtml from "remark-html";

interface MarkdownRendererProps {
  /** Raw markdown string */
  content: string;
}

/**
 * Parses markdown content through remark pipeline and renders
 * sanitized HTML via the `remark-html` plugin (sanitize: true by default).
 *
 * @param content - Raw markdown string from CMS entry
 */
export async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  const result = await remark()
    .use(remarkHtml, { sanitize: true })
    .process(content);

  const html = result.toString();

  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-zs-text-secondary prose-p:leading-relaxed
        prose-a:text-zs-blue prose-a:no-underline hover:prose-a:underline
        prose-strong:text-white
        prose-code:bg-zs-bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zs-cyan
        prose-li:text-zs-text-secondary
        prose-hr:border-zs-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
