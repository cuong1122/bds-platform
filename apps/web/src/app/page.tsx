import { Hero } from "@/components/landing/hero";
import { BuildingsSection } from "@/components/landing/buildings-section";
import { ListingsGrid } from "@/components/landing/listings-grid";
import { LocationSection } from "@/components/landing/location-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <BuildingsSection />
      <ListingsGrid />
      <LocationSection />
    </main>
  );
}
