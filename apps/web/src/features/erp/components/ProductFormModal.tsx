"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { clientFetcher } from "@/utils/api-client";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: any | null;
}

export function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    salePrice: "",
    costPrice: "",
    initialStock: "0",
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        description: product.description || "",
        salePrice: product.salePrice?.toString() || "",
        costPrice: product.costPrice?.toString() || "",
        initialStock: "0", // Not editable for existing products
        isActive: product.isActive ?? true
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        description: "",
        salePrice: "",
        costPrice: "",
        initialStock: "0",
        isActive: true
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = !!product;
    const url = isEdit ? `/erp/products/${product.id}` : "/erp/products";
    const method = isEdit ? "PATCH" : "POST";

    const payload: any = {
      name: formData.name,
      sku: formData.sku || null,
      description: formData.description || null,
      salePrice: parseFloat(formData.salePrice),
      costPrice: parseFloat(formData.costPrice),
      isActive: formData.isActive
    };

    if (!isEdit) {
      payload.initialStock = parseFloat(formData.initialStock) || 0;
    }

    const { error } = await clientFetcher(url, {
      method,
      body: JSON.stringify(payload)
    });

    if (error) {
      toast.error(`Error: ${error}`);
    } else {
      toast.success(isEdit ? "Product updated" : "Product created");
      onSuccess();
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Product" : "New Product"}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input 
            required 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Aceite Sintético 5W30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>SKU (Optional)</Label>
            <Input 
              value={formData.sku} 
              onChange={e => setFormData({...formData, sku: e.target.value})}
              placeholder="e.g. OIL-5W30-01"
              className="font-mono text-xs uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label>Initial Stock</Label>
            <Input 
              type="number" 
              disabled={!!product}
              value={formData.initialStock} 
              onChange={e => setFormData({...formData, initialStock: e.target.value})}
            />
            {product && <p className="text-[10px] text-zs-text-tertiary uppercase">Stock managed via Inventory</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cost Price (₡)</Label>
            <Input 
              required 
              type="number" 
              value={formData.costPrice} 
              onChange={e => setFormData({...formData, costPrice: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label>Sale Price (₡)</Label>
            <Input 
              required 
              type="number" 
              value={formData.salePrice} 
              onChange={e => setFormData({...formData, salePrice: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Short product description..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-zs-blue text-white min-w-[100px]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (product ? "Save Changes" : "Create Product")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
