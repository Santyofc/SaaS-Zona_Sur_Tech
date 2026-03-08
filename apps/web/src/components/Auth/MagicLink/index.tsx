"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail } from "@/utils/validateEmail";
import Loader from "@/components/Common/Loader";
import { createClient } from "@/utils/supabase/client";

const MagicLink = () => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email address.");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    setLoader(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      toast.success("Magic link sent! Check your email.");
      setEmail("");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Unable to send magic link.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-[22px]">
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
      </div>
      <div className="mb-9">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
        >
          Send Magic Link {loader && <Loader />}
        </button>
      </div>
    </form>
  );
};

export default MagicLink;
