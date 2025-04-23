"use client";

/*
 * NOTE: This is a duplicate implementation of the movie detail page.
 * The active implementation is in /movie/[id]/page.tsx
 * This file exists for backward compatibility and redirects to the main movie detail page.
 */

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function MovieDetailRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  useEffect(() => {
    // Redirect to the main movie detail page
    router.replace(`/movie/${id}`);
  }, [router, id]);
  
  // Show a loading state while redirecting
  return (
    <div className="container mx-auto py-12 text-center">
      <p className="text-lg animate-pulse">正在跳转到电影详情页...</p>
    </div>
  );
} 