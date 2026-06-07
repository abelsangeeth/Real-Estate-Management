export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserCreateInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  imageUrl: string;
  isFeatured: boolean;
  amenities: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ListingCreateInput = Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>;
export type ListingUpdateInput = Partial<ListingCreateInput>;

export interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  requestedTourDate?: string;
  listingId: string;
  userId?: string;
  createdAt: Date;
}

export type InquiryCreateInput = Omit<Inquiry, 'id' | 'createdAt'>;
