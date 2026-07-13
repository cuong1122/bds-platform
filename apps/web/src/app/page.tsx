import { Hero } from "@/components/landing/hero";
import { BuildingsSection } from "@/components/landing/buildings-section";
import { ListingsGrid } from "@/components/landing/listings-grid";

export default function Home() {
  return (
    <main>
      <Hero />
      <BuildingsSection />
      <ListingsGrid />
    </main>
  );
}
