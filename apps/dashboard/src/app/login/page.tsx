import { Suspense } from "react";
import LoginForm from "../../components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="w-full min-h-screen bg-[#151f28]">
      <Suspense fallback={<div className="text-white flex items-center justify-center min-h-screen">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
