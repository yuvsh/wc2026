"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout(): Promise<never> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    // Log for ops visibility; redirect anyway — partial teardown is better than none
    console.error("signOut failed:", error.message);
  }
  redirect("/login");
}
