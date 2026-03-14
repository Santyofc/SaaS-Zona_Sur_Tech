"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Boxes, Receipt, ShoppingCart, ArrowRight, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { clientFetcher } from "@/utils/api-client";
import { PerformanceChart } from "@/components/erp/PerformanceChart";
import { toast } from "react-hot-toast";

interface DashboardSummary {
  totalProducts: number;
  totalRevenue: string;
  totalSales: number;
  lowStockCount: number;
  lowStockItems: any[];
  revenueHistory: any[];
}

interface StatCardProps {
  title: string;
  count: string | number;
  icon: React.ReactNode;
  href: string;
  description: string;
  color: "blue" | "red" | "green" | "yellow";
  isLoading?: boolean;
}

function StatCard({ title, count, icon, href, description, color, isLoading }: StatCardProps) {
  const colorMap = {
    blue: "text-zs-blue bg-zs-blue/10 border-zs-blue/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  };

  return (
    <Link href={href} className="group relative overflow-hidden">
      <div className="bg-zs-bg-secondary p-6 rounded-2xl border border-zs-border-primary hover:border-zs-blue transition-all duration-300 shadow-zs-glow-soft hover:shadow-zs-glow-blue h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
              {icon}
            </div>
            <ArrowRight className="w-5 h-5 text-zs-text-tertiary group-hover:text-zs-blue group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-xl font-bold text-zs-text-primary mb-1">{title}</h3>
          <p className="text-zs-text-secondary text-sm mb-4 line-clamp-1">{description}</p>
        </div>
        <div>
          {isLoading ? (
            <div className="h-10 bg-zs-bg-tertiary animate-pulse rounded w-24" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tighter text-zs-text-primary">{count}</span>
            </div>
          )}
        </div>
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-zs-blue/5 rounded-full blur-3xl group-hover:bg-zs-blue/10 transition-colors`} />
    </Link>
  );
}

export default function ERPPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      const { data, error } = await clientFetcher<DashboardSummary>("/erp/dashboard/summary");
      if (error) {
        toast.error("Failed to load dashboard metrics");
      } else {
        setSummary(data);
      }
      setIsLoading(false);
    };
    fetchSummary();
  }, []);

  return (
    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zs-text-primary uppercase italic flex items-center gap-4">
            <span className="bg-zs-blue/10 p-2 rounded-xl border border-zs-blue/20">
              <Zap className="w-10 h-10 text-zs-blue animate-pulse" />
            </span>
            Enterprise <span className="text-zs-blue shadow-zs-glow-blue px-2">Control</span> Center
          </h1>
          <p className="text-zs-text-secondary mt-2 max-w-2xl text-lg font-medium">
            Real-time operational monitoring and strategic ERP command.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/erp/pos">
            <button className="px-6 py-3 bg-zs-blue hover:bg-zs-blue-hover text-white font-bold rounded-xl shadow-zs-glow-blue transition-all active:scale-95 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Open Terminal
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Revenue"
          description="Total 30-day completed sales."
          icon={<Receipt className="w-6 h-6" />}
          count={`₡ ${parseFloat(summary?.totalRevenue || "0").toLocaleString()}`}
          href="/dashboard/erp/sales"
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Stock Alerts"
          description="Items requiring replenishment."
          icon={<AlertTriangle className="w-6 h-6" />}
          count={summary?.lowStockCount || 0}
          href="/dashboard/erp/inventory"
          color={summary?.lowStockCount && summary.lowStockCount > 0 ? "red" : "blue"}
          isLoading={isLoading}
        />
        <StatCard 
          title="Catalog"
          description="Managed SKUs in database."
          icon={<Package className="w-6 h-6" />}
          count={summary?.totalProducts || 0}
          href="/dashboard/erp/products"
          color="blue"
          isLoading={isLoading}
        />
        <StatCard 
          title="Volume"
          description="Total transaction count."
          icon={<TrendingUp className="w-6 h-6" />}
          count={summary?.totalSales || 0}
          href="/dashboard/erp/sales"
          color="blue"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zs-bg-secondary p-8 rounded-2xl border border-zs-border-primary shadow-zs-glow-soft">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-zs-text-primary flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-zs-blue" />
              Revenue Performance
            </h3>
            <span className="text-xs font-mono text-zs-text-tertiary">LAST 7 DAYS</span>
          </div>
          <div className="h-64">
            {isLoading ? (
              <div className="w-full h-full bg-zs-bg-tertiary/50 animate-pulse rounded-xl" />
            ) : (
              <PerformanceChart data={summary?.revenueHistory || []} />
            )}
          </div>
        </div>

        <div className="bg-zs-bg-secondary p-8 rounded-2xl border border-zs-border-primary shadow-zs-glow-soft flex flex-col">
          <h3 className="text-xl font-bold text-zs-text-primary flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical Stock
          </h3>
          <div className="space-y-4 flex-1">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-zs-bg-tertiary animate-pulse rounded-xl" />
              ))
            ) : summary?.lowStockItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Boxes className="w-12 h-12 text-zs-text-tertiary mb-2" />
                <p className="text-xs text-zs-text-tertiary uppercase font-bold tracking-widest">Stock Balanced</p>
              </div>
            ) : (
              summary?.lowStockItems.map((item: any) => (
                <Link 
                  key={item.id} 
                  href="/dashboard/erp/inventory"
                  className="flex items-center justify-between p-3 rounded-xl bg-zs-bg-tertiary border border-zs-border-primary hover:border-red-500/50 transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zs-text-secondary group-hover:text-zs-text-primary transition-colors">{item.name}</span>
                    <span className="text-[10px] text-zs-text-tertiary uppercase font-mono">ID: {item.id.slice(0, 8)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-red-500">{item.currentQuantity}</span>
                    <p className="text-[8px] text-zs-text-tertiary uppercase font-bold">UNITS LEFT</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link href="/dashboard/erp/inventory" className="mt-6 text-center text-xs font-bold text-zs-blue hover:underline uppercase tracking-widest">
            Full Inventory Report
          </Link>
        </div>
      </div>
    </div>
  );
}
