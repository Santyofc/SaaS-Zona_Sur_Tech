"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, Search, Plus, Minus, Trash2, CheckCircle, Package, Loader2 } from "lucide-react";
import { clientFetcher } from "@/utils/api-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  salePrice: string;
  stock?: number;
}

interface CartItem {
  id: string; // productId
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "sinpe">("cash");

  const fetchData = async () => {
    setIsLoading(true);
    const [pRes, bRes] = await Promise.all([
      clientFetcher<Product[]>("/erp/products"),
      clientFetcher<any[]>("/erp/inventory/balances")
    ]);

    if (pRes.data) setProducts(pRes.data.filter((p: any) => p.isActive));
    if (bRes.data) {
      const bMap: Record<string, number> = {};
      (bRes.data as { productId: string; currentQuantity: string }[]).forEach(b => bMap[b.productId] = parseFloat(b.currentQuantity));
      setBalances(bMap);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Barcode support: if search matches exactly one SKU, add it
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length >= 3) {
      const match = products.find(p => p.sku === trimmed);
      if (match) {
        addToCart(match);
        setSearchQuery(""); // Clear for next scan
        toast.success(`Scanning: ${match.name}`);
      }
    }
  }, [searchQuery, products]);

  const addToCart = (product: Product) => {
    const stock = balances[product.id] || 0;
    const existing = cart.find((item: CartItem) => item.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    if (currentQty + 1 > stock) {
      toast.error(`Out of stock for ${product.name}`);
      return;
    }

    if (existing) {
      setCart(cart.map((item: CartItem) => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        quantity: 1, 
        unitPrice: parseFloat(product.salePrice) 
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item: CartItem) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const existing = cart.find((item: CartItem) => item.id === productId);
    if (!existing) return;

    const newQty = existing.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const stock = balances[productId] || 0;
    if (newQty > stock) {
      toast.error("Requested quantity exceeds available stock");
      return;
    }

    setCart(cart.map((item: CartItem) => 
      item.id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const cartTotal = cart.reduce((acc: number, item: CartItem) => acc + (item.quantity * item.unitPrice), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    const { error } = await clientFetcher("/erp/sales", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map((item: CartItem) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        paymentMethod
      })
    });

    if (error) {
      toast.error(`Sale failed: ${error}`);
    } else {
      toast.success("Sale completed successfully!");
      setCart([]);
      fetchData(); // Refresh stock
    }
    setIsSubmitting(false);
  };

  const filteredProducts = products.filter((p: Product) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 p-6 animate-in fade-in duration-500 overflow-hidden">
      {/* LEFT: Product Selection */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="bg-zs-bg-secondary p-4 rounded-xl border border-zs-border-primary shadow-zs-glow-soft">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-zs-text-tertiary" />
            <Input 
              placeholder="Search or Scan Barcode..." 
              className="bg-transparent border-none focus-visible:ring-0 text-zs-text-primary placeholder:text-zs-text-tertiary w-full"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 gap-2">
            {isLoading ? (
              [...Array(6)].map((_, i) => <div key={i} className="h-16 bg-zs-bg-secondary/50 animate-pulse rounded-lg border border-zs-border-primary/30" />)
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-zs-text-tertiary">No active products found.</div>
            ) : (
              filteredProducts.map((product: Product) => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-between p-4 bg-zs-bg-secondary border border-zs-border-primary rounded-xl cursor-pointer hover:border-zs-blue hover:shadow-zs-glow-soft transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zs-bg-tertiary flex items-center justify-center border border-zs-border-primary group-hover:bg-zs-blue/10 group-hover:border-zs-blue/30 transition-colors">
                      <Package className="w-5 h-5 text-zs-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-zs-text-primary text-sm">{product.name}</h3>
                      <p className="text-[10px] text-zs-text-tertiary font-mono uppercase tracking-wider">{product.sku || "NO-SKU"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-zs-text-primary">₡ {parseFloat(product.salePrice).toLocaleString()}</p>
                    <p className={`text-[10px] uppercase font-bold ${
                      (balances[product.id] || 0) <= 5 ? 'text-red-400' : 'text-zs-text-tertiary'
                    }`}>
                      Stock: {balances[product.id] || 0}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Fixed Cart Side Panel */}
      <div className="w-96 flex flex-col bg-zs-bg-secondary rounded-2xl border border-zs-border-primary shadow-zs-glow-blue overflow-hidden">
        <div className="p-6 border-b border-zs-border-primary bg-zs-bg-tertiary/50">
          <h2 className="text-xl font-bold text-zs-text-primary flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-zs-blue" />
            Current Cart
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zs-text-tertiary opacity-50 space-y-4">
              <ShoppingCart className="w-12 h-12" />
              <p className="text-sm">Your cart is empty.</p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div key={item.id} className="p-3 bg-zs-bg-tertiary rounded-xl border border-zs-border-primary animate-in slide-in-from-right-2 duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-zs-text-secondary line-clamp-1">{item.name}</h4>
                  <button onClick={() => removeFromCart(item.id)} className="text-zs-text-tertiary hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-zs-bg-primary border border-zs-border-primary text-zs-text-tertiary hover:text-zs-blue"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center rounded bg-zs-bg-primary border border-zs-border-primary text-zs-text-tertiary hover:text-zs-blue"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-bold text-sm text-zs-text-primary">
                    ₡ {(item.quantity * item.unitPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-zs-bg-tertiary/80 border-t border-zs-border-primary space-y-4 shadow-inner">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-zs-text-tertiary uppercase tracking-widest">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {(["cash", "card", "sinpe"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                    paymentMethod === m 
                      ? "bg-zs-blue/10 border-zs-blue text-zs-blue shadow-zs-glow-soft" 
                      : "bg-zs-bg-primary border-zs-border-primary text-zs-text-tertiary hover:border-zs-text-tertiary/50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-zs-text-tertiary font-bold uppercase tracking-widest text-xs">Total</span>
            <span className="text-2xl font-bold text-zs-text-primary tracking-tighter">
              ₡ {cartTotal.toLocaleString()}
            </span>
          </div>

          <Button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full py-6 rounded-xl bg-zs-blue hover:bg-zs-blue-hover text-white flex items-center justify-center gap-3 font-bold text-lg transition-transform active:scale-95 shadow-zs-glow-blue disabled:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                Finish Sale
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
