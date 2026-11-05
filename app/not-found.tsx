'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
      <span className="font-serif text-6xl text-[#18181B] font-light mb-2">404</span>
      <h1 className="font-serif text-2xl text-[#18181B] mb-3">Page Not Found</h1>
      <p className="text-xs text-[#71717A] max-w-sm mb-6">
        The silhouette or page you are seeking is unavailable in the current atelier catalog.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#18181B] text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-[#27272A] transition-colors"
      >
        Return to Storefront
      </Link>
    </div>
  );
}
