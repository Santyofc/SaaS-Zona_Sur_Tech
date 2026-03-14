
import React from "react";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { Users2 } from "lucide-react";

export default function CRMPage() {
  return <ModulePlaceholder title="CRM" icon={<Users2 className="w-10 h-10 text-zs-blue" />} />;
}
