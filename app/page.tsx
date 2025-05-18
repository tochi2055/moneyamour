// import { redirect } from "next/navigation"

// export default function RootPage() {
//   redirect("/login")
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/contexts/firebase-auth-context";

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (loading) return;

    if (user) {
      console.log("User exists");
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return null;
}
