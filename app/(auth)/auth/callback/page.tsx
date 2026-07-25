"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/home");
      } else {
        // Optionally redirect to login on error
        router.push("/auth");
      }
    };

    handleCallback();
  }, [router, supabase]);

  return (
    <div className="flex items-center justify-center h-screen w-full">
      Loading...
    </div>
  );
}
