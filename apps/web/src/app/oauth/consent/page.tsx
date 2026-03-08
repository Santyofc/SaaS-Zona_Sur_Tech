import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ConsentPage({
    searchParams,
}: {
    searchParams: { authorization_id?: string };
}) {
    const authorizationId = searchParams.authorization_id;

    if (!authorizationId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zs-bg-primary text-zs-text-secondary">
                <div className="rounded-xl border border-zs-border bg-zs-bg-secondary p-8 shadow-zs-glow-blue/20">
                    <h1 className="text-xl font-bold text-white">Error de Autorización</h1>
                    <p className="mt-2 text-sm text-zs-text-muted">Falta el parámetro authorization_id.</p>
                </div>
            </div>
        );
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: any) {
                    cookieStore.set({ name, value: "", ...options });
                },
            },
        }
    );

    // Check if user is authenticated
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // Redirect to login, preserving authorization_id
        redirect(`/login?redirect=/oauth/consent?authorization_id=${authorizationId}`);
    }

    // Get authorization details using the authorization_id
    const { data: authDetails, error } =
        await supabase.auth.oauth.getAuthorizationDetails(authorizationId);

    if (error || !authDetails) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zs-bg-primary text-zs-text-secondary">
                <div className="max-w-md rounded-xl border border-zs-border bg-zs-bg-secondary p-8 shadow-zs-glow-blue/20">
                    <h1 className="text-xl font-bold text-white uppercase tracking-tighter italic">
                        Error de <span className="text-zs-blue">Protocolo</span>
                    </h1>
                    <p className="mt-4 text-sm font-mono text-zs-red break-all bg-black/40 p-3 rounded border border-zs-red/20">
                        {error?.message || "Solicitud de autorización no válida o expirada."}
                    </p>
                    <a
                        href={`/oauth/consent?authorization_id=${authorizationId}`}
                        className="mt-6 block w-full py-2 text-center bg-zs-bg-primary border border-zs-border text-xs uppercase tracking-widest hover:border-zs-blue transition-colors rounded-lg"
                    >
                        Reintentar
                    </a>
                </div>
            </div>
        );
    }

    const clientName = "client" in authDetails ? authDetails.client.name : "aplicación externa";
    const scopes = "scopes" in authDetails && Array.isArray(authDetails.scopes) ? authDetails.scopes : [];
    const redirectUrl = "redirect_url" in authDetails ? authDetails.redirect_url : null;

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-zs-bg-primary overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.1),transparent)]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zs-blue/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg p-8 mx-4">
                <div className="bg-zs-bg-secondary/40 backdrop-blur-2xl border border-zs-border rounded-[2rem] p-10 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zs-blue to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-zs-blue/10 border border-zs-blue/20 flex items-center justify-center mb-6 shadow-zs-glow-blue/10">
                            <span className="text-2xl font-black text-zs-blue italic">ZS</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                            Solicitud de <span className="text-zs-blue shadow-zs-glow-blue">Acceso</span>
                        </h1>
                        <p className="mt-4 text-zs-text-secondary text-sm font-medium leading-relaxed">
                            La aplicación <span className="text-white font-bold">{clientName}</span> solicita permiso para interactuar con tu cuenta de <span className="text-zs-blue font-bold">Zona Sur Tech</span>.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 rounded-2xl bg-black/20 border border-zs-border/50">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-4">
                                Permisos Solicitados
                            </h3>
                            <ul className="space-y-3">
                                {scopes.length > 0 ? (
                                    scopes.map((scope: string) => (
                                        <li key={scope} className="flex items-center gap-3 text-sm text-zs-text-secondary">
                                            <div className="w-1.5 h-1.5 rounded-full bg-zs-green shadow-zs-glow-green" />
                                            <span className="font-mono">{scope}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="flex items-center gap-3 text-sm text-zs-text-secondary italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zs-blue/40" />
                                        Acceso básico al perfil
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="text-[10px] font-medium text-center text-zs-text-muted/60 uppercase tracking-widest px-4">
                            Al hacer clic en aprobar, serás redirigido a: <br />
                            <span className="text-zs-blue/80 lowercase break-all">{redirectUrl ?? "URL de retorno no disponible"}</span>
                        </div>

                        <form action="/api/oauth/decision" method="POST" className="grid grid-cols-2 gap-4 pt-4">
                            <input type="hidden" name="authorization_id" value={authorizationId} />

                            <button
                                type="submit"
                                name="decision"
                                value="deny"
                                className="py-4 px-6 rounded-2xl border border-zs-border text-xs font-black uppercase tracking-widest text-zs-text-secondary hover:bg-zs-red/5 hover:border-zs-red/40 hover:text-zs-red transition-all duration-300 transform active:scale-95"
                            >
                                Denegar
                            </button>

                            <button
                                type="submit"
                                name="decision"
                                value="approve"
                                className="relative py-4 px-6 rounded-2xl bg-zs-blue text-xs font-black uppercase tracking-widest text-black shadow-zs-glow-blue/20 hover:shadow-zs-glow-blue/40 hover:scale-[1.02] transition-all duration-300 transform active:scale-95 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                Aprobar
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-[10px] text-zs-text-muted uppercase tracking-[0.3em]">
                    Plataforma Segura por Zona Sur Tech
                </p>
            </div>
        </div>
    );
}
