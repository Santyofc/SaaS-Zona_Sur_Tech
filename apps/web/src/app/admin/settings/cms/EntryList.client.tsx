"use client";

import { useState } from "react";
import { 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { revalidateCmsEntry } from "@/lib/cms/actions";
import { toast } from "react-hot-toast";

interface Entry {
  id: string;
  slug: string;
  title: string;
  collection_type: string;
  updated_at: string;
  status: string;
}

interface EntryListProps {
  entries: Entry[];
}

export function EntryList({ entries }: EntryListProps) {
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncedIds, setSyncedIds] = useState<Set<string>>(new Set());

  const handleSync = async (entry: Entry) => {
    setSyncingId(entry.id);
    try {
      // Usar Server Action en lugar de fetch para mantener el secreto seguro en el servidor
      const result = await revalidateCmsEntry(entry.collection_type, entry.slug);

      if (!result.success) throw new Error("Error en la revalidación");

      setSyncedIds(prev => new Set(prev).add(entry.id));
      toast.success(`"${entry.title}" sincronizado correctamente`);
    } catch (error) {
      console.error(error);
      toast.error(`Error al sincronizar "${entry.title}"`);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <RefreshCcw className="w-4 h-4 text-zs-blue" />
          Estado de Sincronización (ISR)
        </h2>
        <span className="text-xs text-zs-text-secondary px-2 py-1 rounded-full bg-white/5 border border-white/10 italic">
          Actualización bajo demanda activa
        </span>
      </div>

      <div className="grid gap-3">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative overflow-hidden zs-card-secondary p-4 flex items-center justify-between hover:border-zs-blue/30 transition-all duration-300"
          >
            {/* Background Glow on Hover */}
            <div className="absolute inset-0 bg-zs-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="flex items-center gap-4 relative">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                syncedIds.has(entry.id) ? "bg-green-500/10 text-green-400" : "bg-zs-blue/10 text-zs-blue"
              }`}>
                {syncedIds.has(entry.id) ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white group-hover:text-zs-blue transition-colors">
                    {entry.title}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-zs-text-secondary px-1.5 py-0.5 rounded border border-white/5 bg-white/5 font-mono">
                    {entry.collection_type}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-zs-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(entry.updated_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 opacity-50" />
                    /{entry.slug}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
                <button
                    onClick={() => handleSync(entry)}
                    disabled={syncingId === entry.id}
                    className={`
                        h-9 px-4 rounded-lg flex items-center gap-2 text-xs font-bold transition-all
                        ${syncingId === entry.id 
                            ? "bg-white/5 text-zs-text-secondary cursor-not-allowed" 
                            : "bg-zs-blue/10 hover:bg-zs-blue text-zs-blue hover:text-white"
                        }
                    `}
                >
                    <RefreshCcw className={`w-3.5 h-3.5 ${syncingId === entry.id ? "animate-spin" : ""}`} />
                    {syncingId === entry.id ? "Sincronizando..." : "Forzar Sync"}
                </button>
                
                <a 
                    href={`/blog/${entry.slug}`} 
                    target="_blank" 
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zs-text-secondary hover:text-white transition-all border border-white/5"
                    title="Ver página pública"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
          </motion.div>
        ))}

        {entries.length === 0 && (
          <div className="p-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center opacity-50">
            <AlertCircle className="w-8 h-8 mb-3" />
            <p className="text-sm">No hay entradas publicadas para sincronizar</p>
          </div>
        )}
      </div>
    </div>
  );
}
