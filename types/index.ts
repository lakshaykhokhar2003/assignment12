
export interface DataItem {
  id: string;
  title: string;
  cat: string;
  subCat: string;
  subset: string;
  freq: string;
  unit: string;
  src: string;
  sData: string;
  datatype: string;
  hierarchy: string[];
  db: string;
}

export interface CategoryTree {
  [key: string]: CategoryTree | Record<string, never>;
}

export interface Dataset {
  categories: CategoryTree;
  frequent: DataItem[];
}

export type DatasetType = "IND" | "IMF";

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export interface CategoryTreeProps {
    categories: CategoryTree;
    selectedCategory: string | null;
    selectedCategoryPath: string | null;
    onCategorySelect: (category: string | null, fullPath: string | null) => void;
    parentKey?: string;
}

export interface DataCardProps {
    item: DataItem;
}

