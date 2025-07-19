export interface Part {
  id: string;
  category: string;
  brand: string;
  model: string;
  price_usd: number;
  image_path: string;
  spec: Record<string, unknown>;
}
