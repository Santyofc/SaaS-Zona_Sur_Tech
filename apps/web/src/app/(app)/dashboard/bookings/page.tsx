
import React from "react";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { Calendar } from "lucide-react";

export default function BookingsPage() {
  return <ModulePlaceholder title="Reservas" icon={<Calendar className="w-10 h-10 text-zs-blue" />} />;
}
