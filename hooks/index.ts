"use client";

import {useState, useMemo, useCallback, useEffect} from "react";
import { useRouter } from "next/navigation";
import type { Dataset, DatasetType, DataItem } from "@/types";
import { DATASETS } from "@/constants";
import { filterDataItems } from "@/lib/utils";

export function useAuth() {
    const router = useRouter();

    const login = useCallback(
        (username: string, password: string) => {
            if (username === "admin" && password === "admin") {
                const token = btoa(`${username}:${Date.now()}`);
                document.cookie = `auth_token=${token}; path=/; max-age=86400`;
                router.push("/catalogue");
                return true;
            }
            return false;
        },
        [router]
    );

    const logout = useCallback(() => {
        document.cookie = "auth_token=; path=/; max-age=0";
        router.push("/");
    }, [router]);

    return { login, logout };
}

export function useDataset(initialDataset: DatasetType = "IND") {
    const [dataset, setDataset] = useState<DatasetType>(initialDataset);
    const [data, setData] = useState<Dataset | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDataset = useCallback(async (type: DatasetType) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(DATASETS[type].file);
            if (!response.ok) {
                throw new Error(`Failed to load dataset: ${response.statusText}`);
            }
            const jsonData = await response.json();
            setData(jsonData);
            setDataset(type);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Error loading dataset:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDataset(initialDataset);
    }, []);

    const switchDataset = useCallback(
        (type: DatasetType) => {
            if (type !== dataset) {
                loadDataset(type);
            }
        },
        [dataset, loadDataset]
    );

    return { dataset, data, isLoading, error, switchDataset };
}

export function useFilteredData(
    items: DataItem[] | undefined,
    categories: any,
    itemsPerPage: number = 10
) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryPath, setSelectedCategoryPath] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = useMemo(() => {
        if (!items) return [];
        return filterDataItems(items, searchTerm, selectedCategory, categories);
    }, [items, searchTerm, selectedCategory, categories]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredItems.length / itemsPerPage);
    }, [filteredItems.length, itemsPerPage]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedCategoryPath]);

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const handleCategorySelect = useCallback((category: string | null, path: string | null) => {
        setSelectedCategory(category);
        setSelectedCategoryPath(path);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    return {
        searchTerm,
        selectedCategory,
        selectedCategoryPath,
        currentPage,
        filteredItems,
        paginatedItems,
        totalPages,
        totalFilteredItems: filteredItems.length,
        handleSearch,
        handleCategorySelect,
        handlePageChange,
    };
}