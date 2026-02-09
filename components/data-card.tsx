import { Card } from "@/components/ui/card";
import {DataCardProps} from "@/types";


export function DataCard({ item }: DataCardProps) {
    const {title, cat, subCat, subset, freq, src, unit, id} = item
    return (
        <Card className="p-4 transition-all hover:shadow-lg">
            <div className="space-y-3">
                <h3 className="font-medium leading-tight text-[hsl(var(--foreground))] line-clamp-2">
                    {title}
                </h3>

                <div className="flex flex-wrap gap-2">
                    {cat && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {cat}
            </span>
                    )}
                    {subCat && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              {subCat}
            </span>
                    )}
                    {subset && (
                        <span className="px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {subset}
            </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-[hsl(var(--muted-foreground))]">
                    <div className="space-y-1">
                        <p><span className="font-medium">Frequency:</span> {freq}</p>
                        <p><span className="font-medium">Source:</span> {src}</p>
                    </div>
                    <div className="space-y-1">
                        <p><span className="font-medium">Unit:</span> {unit}</p>
                        <p className="truncate"><span className="font-medium">ID:</span> {id}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
