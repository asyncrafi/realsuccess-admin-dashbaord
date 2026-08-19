"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Banner subtle scale & fade entrance
      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
        );
      }

      // Card container smooth fade up
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", delay: 0.15 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid min-h-screen w-full lg:grid-cols-12 bg-white text-gray-900 overflow-hidden"
    >
      {/* Left Column: Full-Height Banner Image */}
      <div
        ref={bannerRef}
        className="relative hidden lg:block lg:col-span-6 xl:col-span-6 h-screen overflow-hidden bg-gray-900"
      >
        <Image
          src="/auth/banner.png"
          alt="Real Success Event Banner"
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover object-center"
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center min-h-screen px-4 py-8 md:px-12 bg-[#FAFBFD]">
        <div
          ref={cardRef}
          className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl border border-gray-100/80 shadow-2xl shadow-gray-200/60"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
