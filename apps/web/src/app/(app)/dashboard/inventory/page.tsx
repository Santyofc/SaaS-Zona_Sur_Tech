
import React from "react";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { Boxes } from "lucide-react";

export default function InventoryPage() {
  return <ModulePlaceholder title="Inventario" icon={<Boxes className="w-10 h-10 text-zs-blue" />} />;
}
