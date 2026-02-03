"use client";

import { Database, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DataCard } from "@/components/data-card";
import { CategoryTree } from "@/components/category-tree";
import { SearchBar } from "@/components/search-bar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth, useDataset, useFilteredData } from "@/hooks";
import { DATASETS, ITEMS_PER_PAGE } from "@/constants";
import { formatNumber } from "@/lib/utils";
import type { DatasetType } from "@/types";

export default function CataloguePage() {
  const { logout } = useAuth();
  const { dataset, data, isLoading: dataLoading, error, switchDataset } = useDataset();
  const {
    searchTerm,
    selectedCategory,
    selectedCategoryPath,
    currentPage,
    paginatedItems,
    totalPages,
    totalFilteredItems,
    handleSearch,
    handleCategorySelect,
    handlePageChange,
  } = useFilteredData(data?.frequent, data?.categories, ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalFilteredItems);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("ellipsis");
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">India Data Hub</h1>
              <p className="text-xs text-muted-foreground">
                Economic & Financial Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {(Object.keys(DATASETS) as DatasetType[]).map((type) => (
                <Button
                  key={type}
                  variant={dataset === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchDataset(type)}
                  disabled={dataLoading}
                >
                  {DATASETS[type].name}
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-card border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-3">Categories</h2>
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleCategorySelect(null, null)}
            >
              All Categories
            </Button>
          </div>

          {dataLoading ? (
            <div className="p-8 flex justify-center">
              <Spinner />
            </div>
          ) : data?.categories ? (
            <div className="p-4">
              <CategoryTree
                categories={data.categories}
                selectedCategory={selectedCategory}
                selectedCategoryPath={selectedCategoryPath}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          ) : null}
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <SearchBar value={searchTerm} onChange={handleSearch} />

            <div className="text-sm text-muted-foreground">
              {totalFilteredItems > 0 ? (
                <p>
                  Showing <span className="font-medium">{formatNumber(startIndex)}</span> -{" "}
                  <span className="font-medium">{formatNumber(endIndex)}</span> of{" "}
                  <span className="font-medium">{formatNumber(totalFilteredItems)}</span> results
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              ) : !dataLoading && (
                <p>No results found</p>
              )}
            </div>

            {dataLoading ? (
              <div className="py-12 flex flex-col items-center gap-4">
                <Spinner />
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <p className="text-destructive">Error: {error}</p>
                <Button variant="outline" onClick={() => switchDataset(dataset)} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : (
              <>
                {paginatedItems.length > 0 ? (
                  <div className="grid gap-4">
                    {paginatedItems.map((item) => (
                      <DataCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">
                      No datasets match your criteria.
                    </p>
                    {(searchTerm || selectedCategory) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleSearch("");
                          handleCategorySelect(null, null);
                        }}
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                          }}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page as number);
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                          }}
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
