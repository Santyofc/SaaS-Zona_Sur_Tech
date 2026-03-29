"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowRight, FileText, Zap, Terminal, Search, Clock } from "lucide-react";
import { GlitchText } from "@/components/ui/GlitchText.client";
import { AmbientGrid } from "@/components/ui/AmbientGrid.client";
import { AdBanner } from "@/components/ui/AdBanner";
import type { EntryRow } from "@/lib/cms/queries";

interface BlogIndexClientProps {
  initialPosts: EntryRow[];
}

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVars = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = initialPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zs-bg-primary relative overflow-hidden pt-32 pb-24">
      {/* Premium Interactive Background */}
      <AmbientGrid />
      
      {/* Decorative Neural Grid (Static fallback) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(var(--color-zs-blue) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-[10%] left-[-10%] w-[70vw] h-[70vw] bg-zs-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-zs-violet/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <header className="max-w-4xl mx-auto mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8"
          >
            <Terminal className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intel Core // Knowledge Base</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
            <GlitchText text="BLOG" className="text-glow-blue" />
          </h1>

          <div className="mb-12">
            <AdBanner />
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto group">
            <div className="absolute inset-0 bg-zs-blue/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-zs-bg-secondary/40 border border-zs-border rounded-2xl overflow-hidden focus-within:border-zs-blue/50 transition-all">
              <Search className="w-5 h-5 ml-4 text-zs-text-muted transition-colors group-focus-within:text-zs-blue" />
              <input 
                type="text" 
                placeholder="Buscar artículo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-zs-text-muted"
              />
            </div>
          </div>
        </header>

        {filteredPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 border border-dashed border-zs-border rounded-[2rem] bg-white/[0.02]"
          >
            <FileText className="w-16 h-16 mx-auto mb-6 text-zs-text-muted opacity-20" />
            <p className="text-zs-text-secondary font-mono text-sm uppercase tracking-widest">
              No se han encontrado registros encriptados para: <span className="text-zs-blue">"{searchQuery}"</span>
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  variants={itemVars}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <article className="zs-card h-full flex flex-col p-6 space-y-4 group-hover:border-zs-blue/40 group-hover:shadow-zs-glow-blue/10 transition-all duration-500">
                      {/* Hacker Badge */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-zs-blue animate-zs-pulse-dot" />
                          <span className="text-[9px] font-black text-zs-blue uppercase tracking-tighter italic">Status // Active</span>
                        </div>
                        <span className="text-[9px] font-mono text-zs-text-muted">ID: {post.id.slice(0, 8)}</span>
                      </div>

                      {post.coverImage ? (
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zs-bg-primary border border-zs-border relative">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zs-bg-primary/60 to-transparent" />
                        </div>
                      ) : (
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-zs-bg-primary border border-zs-border flex items-center justify-center group-hover:bg-zs-blue/5 transition-colors">
                          <Zap className="w-8 h-8 text-zs-blue/20 group-hover:text-zs-blue/40 transition-colors" />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col space-y-4">
                        <h2 className="text-xl font-black text-white leading-tight uppercase italic group-hover:text-zs-blue transition-colors line-clamp-2">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-xs text-zs-text-secondary leading-relaxed line-clamp-3 font-medium">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-zs-border flex items-center justify-between text-[10px] font-bold text-zs-text-muted uppercase tracking-tight">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {post.author || "ZST Dev"}
                            </span>
                            {post.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Intl.DateTimeFormat("es-CR", { day: '2-digit', month: 'short' }).format(post.publishedAt)}
                              </span>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-zs-blue transform translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
