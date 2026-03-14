"use client";

import React, { useEffect, useState } from "react";
import { Package, Plus, Search, Edit2, Trash2, Power } from "lucide-react";
import { clientFetcher } from "@/utils/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductFormModal } from "@/components/erp/ProductFormModal";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  salePrice: string;
  costPrice: string;
  isActive: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await clientFetcher<Product[]>("/erp/products");
    if (error) {
      toast.error(`Error loading products: ${error}`);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (product: Product) => {
    const { error } = await clientFetcher(`/erp/products/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !product.isActive }),
    });

    if (error) {
      toast.error(`Error updating product: ${error}`);
    } else {
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`);
      fetchProducts();
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zs-text-primary flex items-center gap-2">
            <Package className="w-8 h-8 text-zs-blue" />
            Product Catalog
          </h1>
          <p className="text-zs-text-secondary mt-1">Manage your inventory products and services.</p>
        </div>
        <Button onClick={handleCreate} className="bg-zs-blue hover:bg-zs-blue-hover text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Product
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-zs-bg-secondary p-4 rounded-xl border border-zs-border-primary shadow-zs-glow-soft">
        <Search className="w-5 h-5 text-zs-text-tertiary" />
        <Input 
          placeholder="Search by name or SKU..." 
          className="bg-transparent border-none focus-visible:ring-0 text-zs-text-primary placeholder:text-zs-text-tertiary w-full"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-zs-bg-secondary rounded-xl border border-zs-border-primary overflow-hidden shadow-zs-glow-soft">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zs-bg-tertiary border-b border-zs-border-primary text-zs-text-tertiary uppercase text-xs font-semibold tracking-wider">
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Sale Price</th>
              <th className="px-6 py-4">Cost Price</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zs-border-primary">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-zs-bg-tertiary rounded w-32" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-zs-bg-tertiary rounded w-20" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-zs-bg-tertiary rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-zs-bg-tertiary rounded w-24" /></td>
                  <td className="px-6 py-4"><div className="h-4 bg-zs-bg-tertiary rounded w-16 mx-auto" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 bg-zs-bg-tertiary rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zs-text-tertiary">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product: Product) => (
                <tr key={product.id} className="hover:bg-zs-bg-tertiary/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zs-text-secondary">{product.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-zs-blue">{product.sku || "-"}</td>
                  <td className="px-6 py-4 text-zs-text-primary">₡ {parseFloat(product.salePrice).toLocaleString()}</td>
                  <td className="px-6 py-4 text-zs-text-tertiary text-sm">₡ {parseFloat(product.costPrice).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      product.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(product)}
                      className={`p-2 rounded-lg border transition-all ${
                        product.isActive ? 'border-red-500/20 text-red-500 hover:bg-red-500/10' : 'border-green-500/20 text-green-500 hover:bg-green-500/10'
                      }`}
                      title={product.isActive ? "Deactivate" : "Activate"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg border border-zs-border-primary text-zs-text-secondary hover:bg-zs-bg-tertiary transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchProducts();
        }}
      />
    </div>
  );
}
