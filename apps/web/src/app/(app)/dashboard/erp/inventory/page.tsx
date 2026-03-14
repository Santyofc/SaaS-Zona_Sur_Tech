"use client";

import React, { useEffect, useState } from "react";
import { Boxes, History, ArrowUpDown, Filter, Search } from "lucide-react";
import { clientFetcher } from "@/utils/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";
import { InventoryAdjustmentModal } from "@/components/erp/InventoryAdjustmentModal";

interface Balance {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  currentQuantity: string;
  updatedAt: string;
}

interface Movement {
  id: string;
  productName: string;
  movementType: string;
  quantity: string;
  createdAt: string;
  note: string | null;
}

export default function InventoryPage() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"balances" | "movements">("balances");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdjOpen, setIsAdjOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [bRes, mRes] = await Promise.all([
      clientFetcher<Balance[]>("/erp/inventory/balances"),
      clientFetcher<Movement[]>("/erp/inventory/movements")
    ]);

    if (bRes.error) toast.error(`Error loading balances: ${bRes.error}`);
    else setBalances(bRes.data || []);

    if (mRes.error) toast.error(`Error loading history: ${mRes.error}`);
    else setMovements(mRes.data || []);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBalances = balances.filter(b => 
    b.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zs-text-primary flex items-center gap-2">
            <Boxes className="w-8 h-8 text-zs-blue" />
            Inventory Control
          </h1>
          <p className="text-zs-text-secondary mt-1">Monitor stock levels and movement history.</p>
        </div>
        <Button onClick={() => setIsAdjOpen(true)} className="bg-zs-blue hover:bg-zs-blue-hover text-white flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4" />
          Manual Adjustment
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center p-1 bg-zs-bg-secondary w-fit rounded-xl border border-zs-border-primary">
          <button 
            onClick={() => setActiveTab("balances")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "balances" ? "bg-zs-bg-tertiary text-zs-blue shadow-zs-glow-soft" : "text-zs-text-tertiary hover:text-zs-text-secondary"
            }`}
          >
            <Boxes className="w-4 h-4" /> Current Balances
          </button>
          <button 
            onClick={() => setActiveTab("movements")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "movements" ? "bg-zs-bg-tertiary text-zs-blue shadow-zs-glow-soft" : "text-zs-text-tertiary hover:text-zs-text-secondary"
            }`}
          >
            <History className="w-4 h-4" /> Movement Ledger
          </button>
        </div>

        <div className="flex items-center gap-2 bg-zs-bg-secondary p-4 rounded-xl border border-zs-border-primary shadow-zs-glow-soft">
          <Search className="w-5 h-5 text-zs-text-tertiary" />
          <Input 
            placeholder="Search by product name or SKU..." 
            className="bg-transparent border-none focus-visible:ring-0 text-zs-text-primary placeholder:text-zs-text-tertiary w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === "balances" ? (
          <div className="bg-zs-bg-secondary rounded-xl border border-zs-border-primary overflow-hidden shadow-zs-glow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zs-bg-tertiary border-b border-zs-border-primary text-zs-text-tertiary uppercase text-xs font-semibold tracking-wider">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-center">In Stock</th>
                  <th className="px-6 py-4 text-right">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zs-border-primary">
                {isLoading ? (
                  [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse h-12 bg-zs-bg-tertiary/10" />)
                ) : filteredBalances.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-zs-text-tertiary">No records found.</td></tr>
                ) : (
                  filteredBalances.map((b) => (
                    <tr key={b.id} className="hover:bg-zs-bg-tertiary/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-zs-text-secondary">{b.productName}</td>
                      <td className="px-6 py-4 font-mono text-xs text-zs-blue">{b.sku || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg font-mono font-bold ${
                          parseFloat(b.currentQuantity) <= 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                        }`}>
                          {parseFloat(b.currentQuantity).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-zs-text-tertiary">
                        {new Date(b.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-zs-bg-secondary rounded-xl border border-zs-border-primary overflow-hidden shadow-zs-glow-soft">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zs-bg-tertiary border-b border-zs-border-primary text-zs-text-tertiary uppercase text-xs font-semibold tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-center">Quantity</th>
                  <th className="px-6 py-4">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zs-border-primary">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-zs-bg-tertiary/50 transition-colors">
                    <td className="px-6 py-4 text-xs text-zs-text-tertiary whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-zs-text-secondary">{m.productName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded border border-zs-border-primary text-[10px] uppercase font-bold text-zs-text-tertiary bg-zs-bg-tertiary">
                        {m.movementType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-center font-mono font-bold ${parseFloat(m.quantity) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {parseFloat(m.quantity) > 0 ? `+${m.quantity}` : m.quantity}
                    </td>
                    <td className="px-6 py-4 text-xs text-zs-text-tertiary truncate max-w-[200px]">{m.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InventoryAdjustmentModal 
        isOpen={isAdjOpen}
        onClose={() => setIsAdjOpen(false)}
        onSuccess={() => {
          setIsAdjOpen(false);
          fetchData();
        }}
        products={balances.map(b => ({ id: b.productId, name: b.productName }))}
      />
    </div>
  );
}
