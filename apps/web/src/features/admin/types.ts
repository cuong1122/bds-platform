export interface InquiryAdmin {
  id: number;
  listing_id: number;
  listing_code: string;
  building_name: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_time: string | null;
  message: string | null;
  is_confirmed: boolean;
  created_at: string;
}

export interface ListingInterest {
  listing_id: number;
  listing_code: string;
  building_name: string;
  view_count: number;
  favorite_count: number;
  inquiry_count: number;
  interest_score: number;
}
