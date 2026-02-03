"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente al login ya que no hay landing page
    router.replace("/login");
  }, [router]);

  return null; // No renderizar nada mientras redirige
}

