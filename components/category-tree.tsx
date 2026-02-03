"use client";

import { useState, useRef } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {CategoryTreeProps} from "@/types";
import { cn } from "@/lib/utils";


export function CategoryTree({
                                 categories,
                                 selectedCategory,
                                 selectedCategoryPath,
                                 onCategorySelect,
                                 parentKey = "",
                             }: CategoryTreeProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

    const toggleCategory = (key: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const handleCategoryClick = (key: string, fullKey: string, hasChildren: boolean) => {
        if (hasChildren) {
            toggleCategory(fullKey);
        }

        const buttonElement = buttonRefs.current.get(fullKey);
        if (buttonElement) {
            const sidebar = buttonElement.closest('aside');
            if (sidebar) {
                const buttonRect = buttonElement.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                const relativeTop = buttonRect.top - sidebarRect.top;

                sidebar.scrollTo({
                    top: sidebar.scrollTop + relativeTop - 100,
                    behavior: 'smooth'
                });
            }
        }

        onCategorySelect(key, fullKey);
    };

    return (
        <div className="space-y-0.5">
            {Object.entries(categories).map(([key, value]) => {
                const fullKey = parentKey ? `${parentKey} > ${key}` : key;
                const hasChildren = value && typeof value === "object" && Object.keys(value).length > 0;
                const isExpanded = expandedCategories.has(fullKey);
                const isSelected = selectedCategoryPath === fullKey;

                return (
                    <div key={fullKey}>
                        <button
                            ref={(el) => {
                                if (el) {
                                    buttonRefs.current.set(fullKey, el);
                                } else {
                                    buttonRefs.current.delete(fullKey);
                                }
                            }}
                            onClick={() => handleCategoryClick(key, fullKey, hasChildren)}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isSelected && "bg-primary/10 text-primary font-medium"
                            )}
                        >
                            <span className="truncate">{key}</span>
                            {hasChildren && (
                                <span className="ml-2 flex-shrink-0">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
                            )}
                        </button>
                        {hasChildren && isExpanded && (
                            <div className="ml-3 mt-0.5 border-l border-border pl-1">
                                <CategoryTree
                                    categories={value}
                                    selectedCategory={selectedCategory}
                                    selectedCategoryPath={selectedCategoryPath}
                                    onCategorySelect={onCategorySelect}
                                    parentKey={fullKey}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}