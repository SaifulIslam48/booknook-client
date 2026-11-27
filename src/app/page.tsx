import Hero from "@/components/home/Hero";
import NewArrivals from "@/components/home/NewArrivals";
import Sections from "@/components/home/Sections";

import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="fade">
      <Suspense fallback={null}>
        <Hero />
      </Suspense>
      <Suspense fallback={null}>
        <NewArrivals />
      </Suspense>
      <Suspense fallback={null}>
        <Sections />
      </Suspense>
    </div>
  );
}
