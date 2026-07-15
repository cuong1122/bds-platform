import type { Metadata } from "next";
import { fetchListingDetail } from "@/features/listing/api";
import ListingDetailClient from "./listing-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const listing = await fetchListingDetail(Number(id));
    const priceInBillion = (parseFloat(listing.price) / 1_000_000_000).toFixed(
      1
    );
    const coverImage =
      listing.images.find((img) => img.is_cover)?.url ||
      listing.images[0]?.url;

    return {
      title: `Căn ${listing.code} - ${listing.building.name} | ${priceInBillion} tỷ`,
      description: `Căn hộ ${listing.code} tại ${listing.building.name}, ${listing.area}m², ${listing.bedrooms || ""} phòng ngủ. ${listing.description || ""}`.slice(
        0,
        160
      ),
      openGraph: {
        title: `Căn ${listing.code} - ${listing.building.name}`,
        description: `${priceInBillion} tỷ · ${listing.area}m² · ${listing.building.address}`,
        images: coverImage ? [{ url: coverImage }] : [],
        type: "website",
      },
    };
  } catch {
    return {
      title: "Căn hộ không tồn tại",
    };
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetailClient id={Number(id)} />;
}
