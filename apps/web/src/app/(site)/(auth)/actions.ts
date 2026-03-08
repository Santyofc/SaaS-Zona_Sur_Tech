"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/signin?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/signin?message=Check your email to continue sign in process");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/signin");
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/forgot-password?message=Identity verification link sent. Check your secure comms.");
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  return redirect("/signin?message=Security key updated. Access restored.");
}
