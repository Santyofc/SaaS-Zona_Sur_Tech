"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear la cuenta.");
      }

      router.push('/login');
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Ocurrió un error inesperado.");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-2xl bg-zs-rose/20 border border-zs-rose/30 text-zs-rose text-sm font-bold animate-zs-fade-in">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-bold text-zs-text-secondary">Nombre Completo</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zs-text-secondary" />
          <input 
            name="name" 
            type="text" 
            placeholder="Tu Nombre" 
            required
            className="zs-input w-full pl-12" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zs-text-secondary">Email Corporativo</label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zs-text-secondary" />
          <input 
            name="email" 
            type="email" 
            placeholder="contacto@empresa.com" 
            required
            className="zs-input w-full pl-12" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-zs-text-secondary">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zs-text-secondary" />
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required
            className="zs-input w-full pl-12" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="zs-btn-brand w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear Account"}
      </button>

      <p className="text-center text-sm text-zs-text-muted font-medium">
        ¿Ya tienes cuenta? <Link href="/login" className="text-zs-blue font-bold hover:underline">Inicia sesión</Link>
      </p>
    </form>
  );
}
