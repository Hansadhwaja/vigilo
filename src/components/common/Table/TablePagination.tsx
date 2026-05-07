import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TablePaginationProps {
  currentPage?: number;
  totalPages?: number;
  limit?: number;

  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const TablePagination = ({
  currentPage = 1,
  totalPages = 1,
  limit = 10,

  onPageChange,
  onLimitChange,
}: TablePaginationProps) => {
  const safeTotalPages = Math.max(1, totalPages);

  const safeCurrentPage = Math.min(
    Math.max(1, currentPage),
    safeTotalPages
  );

  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (safeTotalPages <= 7) {
      return Array.from(
        { length: safeTotalPages },
        (_, i) => i + 1
      );
    }

    pages.push(1);

    if (safeCurrentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, safeCurrentPage - 1);
    const end = Math.min(
      safeTotalPages - 1,
      safeCurrentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (safeCurrentPage < safeTotalPages - 2) {
      pages.push("...");
    }

    pages.push(safeTotalPages);

    return pages;
  };

  return (
    <div className="flex flex-col gap-4 border-t bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Page{" "}
          <span className="font-semibold text-foreground">
            {safeCurrentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {safeTotalPages}
          </span>
        </p>

        <div className="hidden h-5 w-px bg-border sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Rows
          </span>

          <Select
            value={String(limit)}
            onValueChange={(value) =>
              onLimitChange(Number(value))
            }
          >
            <SelectTrigger className="h-9 w-[80px] rounded-xl border-muted shadow-none">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {[6, 10, 20, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={String(size)}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl"
          disabled={safeCurrentPage === 1}
          onClick={() =>
            onPageChange(safeCurrentPage - 1)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {generatePages().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={
                  safeCurrentPage === page
                    ? "default"
                    : "ghost"
                }
                size="icon"
                className={`h-9 w-9 rounded-xl text-sm ${safeCurrentPage === page
                  ? "shadow-sm"
                  : ""
                  }`}
                onClick={() =>
                  onPageChange(page as number)
                }
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl"
          disabled={
            safeCurrentPage === safeTotalPages
          }
          onClick={() =>
            onPageChange(safeCurrentPage + 1)
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;