
import React from "react";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { LifeBuoy } from "lucide-react";

export default function TicketsPage() {
  return <ModulePlaceholder title="Tickets" icon={<LifeBuoy className="w-10 h-10 text-zs-blue" />} />;
}
