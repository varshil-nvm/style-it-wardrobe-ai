
export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  size: string;
  brand: string;
  tags: string[];
  imageUrl: string;
  timesWorn: number;
  lastWashed: string | null;
  isDirty: boolean;
}

export interface OutfitItem {
  id: string;
  name: string;
  items: ClothingItem[];
  date?: Date;
  notes?: string;
  favorite: boolean;
}
