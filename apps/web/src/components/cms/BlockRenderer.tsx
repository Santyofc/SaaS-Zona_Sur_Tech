/**
 * BlockRenderer — Server Component
 *
 * Renders CMS page blocks into actual HTML.
 * Each block type gets its own section with the ZST design system.
 *
 * Supported blocks:
 * - hero: full-width hero with title, subtitle, CTA
 * - features: icon grid with title + description per item
 * - cta: call-to-action section
 * - richtext: raw markdown rendered as HTML
 * - image: responsive image with optional caption
 */
import Link from "next/link";
import type { Block } from "@repo/db/cms-schema";

interface BlockRendererProps {
  blocks: Block[];
}

function HeroBlock({ title, subtitle, ctaLabel, ctaHref }: Extract<Block, { type: "hero" }>) {
  return (
    <section className="py-24 px-4 text-center relative">
      <h1
        className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.95] mb-6"
        style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-zs-text-secondary font-light max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>
      )}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-3 px-8 py-4 bg-zs-blue text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </section>
  );
}

function FeaturesBlock({ title, items }: Extract<Block, { type: "features" }>) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {title && (
          <h2 className="text-3xl md:text-5xl font-black text-white text-center uppercase italic tracking-tighter mb-16">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="zs-card p-8 bg-zs-bg-secondary/40"
            >
              {item.icon && (
                <span className="text-2xl mb-4 block">{item.icon}</span>
              )}
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-zs-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBlock({ title, subtitle, ctaLabel, ctaHref }: Extract<Block, { type: "cta" }>) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="rounded-[2rem] bg-gradient-to-br from-zs-bg-secondary to-black border border-zs-border p-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-zs-text-secondary mb-10 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-3 px-10 py-5 bg-zs-blue text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zs-blue/80 transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function RichTextBlock({ body }: Extract<Block, { type: "richtext" }>) {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-a:text-zs-blue prose-a:no-underline hover:prose-a:underline
            prose-code:bg-zs-bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </section>
  );
}

function ImageBlock({ src, alt, caption }: Extract<Block, { type: "image" }>) {
  return (
    <figure className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full rounded-2xl border border-zs-border"
          loading="lazy"
        />
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-zs-text-muted italic">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={i} {...block} />;
          case "features":
            return <FeaturesBlock key={i} {...block} />;
          case "cta":
            return <CtaBlock key={i} {...block} />;
          case "richtext":
            return <RichTextBlock key={i} {...block} />;
          case "image":
            return <ImageBlock key={i} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
