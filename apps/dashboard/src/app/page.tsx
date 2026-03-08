import { redirect } from "next/navigation";

/**
 * Dashboard Root Redirect
 * 
 * Since the main dashboard logic lives under /dashboard, we redirect
 * the root traffic to provide a seamless entry point.
 */
export default function RootPage() {
    redirect("/dashboard");
}
