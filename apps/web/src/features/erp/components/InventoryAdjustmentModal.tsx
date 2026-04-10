"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { clientFetcher } from "@/utils/api-client";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface InventoryAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  products: { id: string, name: string }[];
}

export function InventoryAdjustmentModal({ isOpen, onClose, onSuccess, products }: InventoryAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    movementType: "manual_adjustment",
    note: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error("Please select a product");
      return;
    }

    setIsSubmitting(true);
    const { error } = await clientFetcher("/erp/inventory/adjust", {
      method: "POST",
      body: JSON.stringify({
        productId: formData.productId,
        quantity: parseFloat(formData.quantity),
        movementType: formData.movementType,
        note: formData.note || null
      })
    });

    if (error) toast.error(`Error: ${error}`);
    else {
      toast.success("Inventory adjusted successfully");
      onSuccess();
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manual Stock Adjustment">
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label>Product</Label>
          <select 
            required
            className="w-full bg-zs-bg-tertiary border border-zs-border-primary rounded-lg px-3 py-2 text-zs-text-primary focus:outline-none focus:ring-1 focus:ring-zs-blue transition-all"
            value={formData.productId}
            onChange={e => setFormData({...formData, productId: e.target.value})}
          >
            <option value="">Select a product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Quantity Change</Label>
            <Input 
              required
              type="number"
              placeholder="e.g. 10 or -5"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
            />
            <p className="text-[10px] text-zs-text-tertiary uppercase">Positive = IN, Negative = OUT</p>
          </div>
          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <select 
              className="w-full bg-zs-bg-tertiary border border-zs-border-primary rounded-lg px-3 py-2 text-zs-text-primary focus:outline-none focus:ring-1 focus:ring-zs-blue transition-all"
              value={formData.movementType}
              onChange={e => setFormData({...formData, movementType: e.target.value})}
            >
              <option value="manual_adjustment">Manual Adjustment</option>
              <option value="initial_stock">Initial Stock</option>
              <option value="internal_transfer">Internal Transfer</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Note (Optional)</Label>
          <Input 
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
            placeholder="Reason for adjustment..."
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="bg-zs-blue text-white min-w-[120px]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply Adjustment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
