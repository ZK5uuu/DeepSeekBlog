"use client";

/*
 * NOTE: This is a duplicate implementation of the movie genre page.
 * The active implementation is in /movie/page.tsx
 * This file exists for backward compatibility and redirects to the main movie page.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MovieGenreRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main movie page
    router.replace("/movie");
  }, [router]);
  
  // Show a loading state while redirecting
  return (
    <div className="container mx-auto py-12 text-center">
      <p className="text-lg animate-pulse">正在跳转到电影页面...</p>
    </div>
  );
} 