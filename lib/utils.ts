import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { DataItem, CategoryTree } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function findCategoryInTree(
    tree: CategoryTree,
    targetCategory: string,
    parentPath: string = ""
): { subtree: CategoryTree | null; fullPath: string } {
    for (const [key, value] of Object.entries(tree)) {
        const currentPath = parentPath ? `${parentPath} > ${key}` : key;

        if (key === targetCategory) {
            return {
                subtree: value as CategoryTree,
                fullPath: currentPath
            };
        }

        if (value && typeof value === "object" && Object.keys(value).length > 0) {
            const result = findCategoryInTree(value as CategoryTree, targetCategory, currentPath);
            if (result.subtree !== null) {
                return result;
            }
        }
    }

    return { subtree: null, fullPath: "" };
}

export function getAllCategoryNamesWithPaths(
    tree: CategoryTree,
    parentPath: string = ""
): Set<string> {
    const categories = new Set<string>();

    Object.entries(tree).forEach(([key, value]) => {
        const fullPath = parentPath ? `${parentPath} > ${key}` : key;
        categories.add(key);
        categories.add(fullPath);

        if (value && typeof value === "object" && Object.keys(value).length > 0) {
            const subcats = getAllCategoryNamesWithPaths(value, fullPath);
            subcats.forEach(cat => categories.add(cat));
        }
    });

    return categories;
}

export function filterDataItems(
    items: DataItem[],
    searchTerm: string,
    selectedCategory: string | null,
    categories?: CategoryTree
): DataItem[] {
    let filtered = items;

    if (selectedCategory && categories) {
        const { subtree } = findCategoryInTree(categories, selectedCategory);

        const allSubcategories = subtree
            ? getAllCategoryNamesWithPaths(subtree, selectedCategory)
            : new Set<string>();

        filtered = filtered.filter((item) => {
            return item.cat === selectedCategory ||
                item.subCat === selectedCategory ||
                allSubcategories.has(item.cat) ||
                allSubcategories.has(item.subCat) ||
                allSubcategories.has(`${item.cat} > ${item.subCat}`);
        });
    }

    if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
            (item) =>
                item.title.toLowerCase().includes(search) ||
                item.cat.toLowerCase().includes(search) ||
                item.subCat.toLowerCase().includes(search) ||
                item.id.toLowerCase().includes(search)
        );
    }

    return filtered;
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-IN").format(num);
}
