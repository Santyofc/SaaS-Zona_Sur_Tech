import React from "react";
import { Scale } from "lucide-react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | Zona Sur Tech",
  description: "Terms of Service and API usage guidelines for Zona Sur Tech.",
};

export default function TermsPage() {
  return (
    <main className="pt-32 pb-20 px-4 md:px-8 bg-zs-bg-primary min-h-screen font-sans">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zs-violet/10 border border-zs-violet/20 text-zs-violet mb-6">
            <Scale className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
            Terms of <span className="text-zs-violet">Service</span>
          </h1>
          <p className="text-zs-text-secondary text-lg leading-relaxed">
            These Terms of Service govern your use of the Zona Sur Tech platform, APIs, and OAuth integrations. By accessing our services, you agree to these minimum required standards of operation.
          </p>
        </div>

        <div className="grid gap-8 text-zs-text-secondary leading-relaxed">
          <section className="zs-card p-8 border-zs-border/50">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-4">1. Acceptance of terms</h2>
            <p className="mb-4">
              By registering an account (either manually or via third-party OAuth providers like Google or GitHub), you confirm your understanding and acceptance of these Terms of Service. If you do not agree, you must cease use of our services immediately.
            </p>
          </section>

          <section className="zs-card p-8 border-zs-border/50">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-4">2. Account Responsibility</h2>
            <p className="mb-4">
              You are responsible for maintaining the security of your account credentials. When using OAuth authentication, you must also maintain the security of your third-party provider accounts. We are not liable for any compromises originating from your third-party linked accounts.
            </p>
          </section>

          <section className="zs-card p-8 border-zs-border/50">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-4">3. Permitted Usage</h2>
            <p className="mb-4">
              Our services are provided for legitimate business and personal use. You agree NOT to use the platform for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-sm mt-4">
              <li>Distributing malware, spam, or participating in malicious activities.</li>
              <li>Attempting to bypass security infrastructure or load balancers.</li>
              <li>Reverse-engineering proprietary software architectures.</li>
            </ul>
          </section>

          <section className="zs-card p-8 border-zs-border/50">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              Zona Sur Tech retains all intellectual property rights to the platform, including its codebase, design system (&quot;Hacker-Tech Aesthetic&quot;), and associated trademarks. You are granted a limited, personal, non-transferable license to use the service.
            </p>
          </section>

          <section className="zs-card p-8 border-zs-border/50">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              Zona Sur Tech provides its services on an &quot;AS IS&quot; basis. To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the platform.
            </p>
          </section>

          <section className="zs-card p-8 border-zs-border/50">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-4">6. Contact Information</h2>
            <p className="mb-4">
              If you have any questions regarding these Terms or need assistance with your account, please contact our Legal and Operations team at:
            </p>
            <p className="font-bold text-white text-lg">
              {siteConfig.contact.emails.corporate}
            </p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-zs-border text-center">
          <p className="text-sm text-zs-text-muted italic">
            Last Updated: March 2026. Zona Sur Tech Systems.
          </p>
        </div>
      </div>
    </main>
  );
}
