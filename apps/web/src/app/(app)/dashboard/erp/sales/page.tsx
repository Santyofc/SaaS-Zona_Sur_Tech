"use client";

import React, { useEffect, useState } from "react";
import { Receipt, Search, FileText, Ban, ChevronRight, Loader2 } from "lucide-react";
import { clientFetcher } from "@/utils/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";

interface Sale {
  id: string;
  saleNumber: string;
  total: string;
  status: "completed" | "cancelled";
  createdAt: string;
  paymentMethod: string | null;
}

interface SaleDetail extends Sale {
  items: {
    id: string;
    productName: string;
    quantity: string;
    unitPrice: string;
    total: string;
  }[];
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<SaleDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const fetchSales = async () => {
    setIsLoading(true);
    const { data, error } = await clientFetcher<Sale[]>("/erp/sales");
    if (error) toast.error(`Error: ${error}`);
    else setSales(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleViewDetails = async (saleId: string) => {
    setIsDetailLoading(true);
    const { data, error } = await clientFetcher<SaleDetail>(`/erp/sales/${saleId}`);
    if (error) toast.error(`Error cargando detalle: ${error}`);
    else setSelectedSale(data);
    setIsDetailLoading(false);
  };

  const handleCancelSale = async (saleId: string) => {
    if (!confirm("Seguro que deseas cancelar esta venta? El stock sera revertido.")) return;

    setIsCancelLoading(true);
    const { error } = await clientFetcher(`/erp/sales/${saleId}/cancel`, { method: "POST" });
    if (error) toast.error(`Error: ${error}`);
    else {
      toast.success("Venta cancelada y stock revertido");
      setSelectedSale(null);
      fetchSales();
    }
    setIsCancelLoading(false);
  };

  const filteredSales = sales.filter(s => 
    s.saleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zs-text-primary flex items-center gap-2">
            <Receipt className="w-8 h-8 text-zs-blue" />
            Historial de ventas
          </h1>
          <p className="mt-1 text-zs-text-secondary">Revisa y gestiona transacciones realizadas.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-zs-bg-secondary p-4 rounded-xl border border-zs-border-primary shadow-zs-glow-soft">
        <Search className="w-5 h-5 text-zs-text-tertiary" />
        <Input 
          placeholder="Buscar por numero de venta..." 
          className="bg-transparent border-none focus-visible:ring-0 text-zs-text-primary placeholder:text-zs-text-tertiary w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Buscar por numero de venta"
        />
      </div>

      <div className="bg-zs-bg-secondary rounded-xl border border-zs-border-primary overflow-hidden shadow-zs-glow-soft">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zs-bg-tertiary border-b border-zs-border-primary text-zs-text-tertiary uppercase text-xs font-semibold tracking-wider">
              <th className="px-6 py-4">Venta #</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zs-border-primary">
            {isLoading ? (
              [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse h-12 bg-zs-bg-tertiary/10" />)
            ) : filteredSales.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-zs-text-tertiary">No hay ventas registradas.</td></tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-zs-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-zs-blue">{sale.saleNumber}</td>
                  <td className="px-6 py-4 text-xs text-zs-text-tertiary">{new Date(sale.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-bold text-zs-text-primary">₡ {parseFloat(sale.total).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                      sale.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {sale.status === "completed" ? "Completada" : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      type="button"
                      onClick={() => handleViewDetails(sale.id)}
                      className="p-2 rounded-lg border border-zs-border-primary text-zs-text-tertiary hover:text-zs-blue hover:bg-zs-bg-tertiary transition-all"
                      aria-label={`Ver detalle de venta ${sale.saleNumber}`}
                      title={`Ver detalle de venta ${sale.saleNumber}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!selectedSale} 
        onClose={() => setSelectedSale(null)} 
        title={`Detalle de venta: ${selectedSale?.saleNumber}`}
      >
        {selectedSale && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-zs-text-tertiary uppercase text-[10px] font-bold">Estado</p>
                <p className={`font-bold ${selectedSale.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedSale.status === "completed" ? "COMPLETADA" : "CANCELADA"}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-zs-text-tertiary uppercase text-[10px] font-bold">Monto total</p>
                <p className="text-xl font-bold text-zs-text-primary">₡ {parseFloat(selectedSale.total).toLocaleString()}</p>
              </div>
            </div>

            <div className="border border-zs-border-primary rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zs-bg-tertiary text-zs-text-tertiary">
                  <tr>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2 text-center">Cant.</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zs-border-primary">
                  {selectedSale.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-zs-text-secondary">{item.productName}</td>
                      <td className="px-4 py-2 text-center text-zs-text-tertiary">{item.quantity}</td>
                      <td className="px-4 py-2 text-right text-zs-text-primary">₡ {parseFloat(item.total).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4">
              {selectedSale.status === 'completed' && (
                <Button 
                  onClick={() => handleCancelSale(selectedSale.id)}
                  disabled={isCancelLoading}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 flex items-center gap-2"
                >
                  {isCancelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                  Cancelar venta
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedSale(null)} className="ml-auto">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
