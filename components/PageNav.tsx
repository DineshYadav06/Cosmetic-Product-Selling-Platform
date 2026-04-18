"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";

interface PageNavProps {
  /** Current page label shown as breadcrumb, e.g. "Delivery Information" */
  label?: string;
}

export default function PageNav({ label }: PageNavProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between gap-4">

        {/* Left: Back + Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[#888] hover:text-[#d4af37] transition-colors text-[11px] uppercase tracking-[0.2em] font-bold whitespace-nowrap group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>

          {label && (
            <>
              <ChevronRight size={12} className="text-[#333] flex-shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#555] font-bold truncate">
                {label}
              </span>
            </>
          )}
        </div>

        {/* Right: Home */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] font-bold whitespace-nowrap group"
        >
          <Home
            size={13}
            className="group-hover:scale-110 transition-transform"
          />
          Home
        </Link>
      </div>
    </div>
  );
}
