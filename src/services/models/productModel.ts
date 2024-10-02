export interface Product {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand: string;
  sku: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  ratingCount?: number;
  images?: string[];
  thumbnail?: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: Date;
  reviewerName: string;
  reviewerEmail: string;
}

export interface CategoryResponse {
  success: boolean;
  categories: string[]; // or any other type you expect
}
