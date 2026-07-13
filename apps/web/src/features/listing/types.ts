export type ListingStatus = "available" | "reserved" | "sold";

export type Direction =
  | "north"
  | "south"
  | "east"
  | "west"
  | "northeast"
  | "northwest"
  | "southeast"
  | "southwest";

export type ListingSort =
  | "price_asc"
  | "price_desc"
  | "area_asc"
  | "area_desc"
  | "created_desc"
  | "price_per_m2_asc"
  | "price_per_m2_desc";

export interface ListingImage {
  id: number;
  url: string;
  order: number;
  is_cover: boolean;
  caption: string | null;
}

export interface Tag {
  id: number;
  name: string;
  type: string;
}

export interface BuildingMinimal {
  id: number;
  name: string;
  address: string;
}

export interface Building {
  id: number;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  cover_image: string | null;
}

export interface ListingListItem {
  id: number;
  building_name: string;
  code: string;
  price: string;
  area: number;
  bedrooms: number | null;
  status: ListingStatus;
  images: ListingImage[];
}

export interface ListingDetail {
  id: number;
  building: BuildingMinimal;
  code: string;
  price: string;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  direction: Direction | null;
  status: ListingStatus;
  description: string | null;
  created_at: string;
  images: ListingImage[];
  tags: Tag[];
}

export interface PaginatedListings {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  items: ListingListItem[];
}

export interface ListingFilterParams {
  building_id?: number;
  status?: ListingStatus;
  direction?: Direction;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  min_bedrooms?: number;
  tag_ids?: number[];
  search?: string;
  sort?: ListingSort;
  page?: number;
  page_size?: number;
}
