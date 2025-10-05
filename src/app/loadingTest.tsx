"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center bg-background px-6 h-[calc(100svh-8rem)] text-primary">
      <div>
        <Image
          src="/mainlogo2.png"
          alt="Siru Bhurtel Photography Logo"
          width={200}
          height={140}
          className="w-auto h-auto"
          priority
        />
      </div>
    </div>
  );
}
