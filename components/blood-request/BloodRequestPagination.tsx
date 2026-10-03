"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function BloodRequestPagination({
  currentPage = 1,
  totalPages = 1,
}: {
  currentPage?: number;
  totalPages?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-lg border-border bg-app-background hover:bg-muted cursor-pointer"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant="outline"
              size="icon"
              className={
                isActive
                  ? "size-9 rounded-lg border-app-primary bg-app-primary text-white hover:bg-app-primary/90 cursor-pointer"
                  : "size-9 rounded-lg border-border bg-app-background hover:bg-muted"
              }
              onClick={() => goToPage(page)}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-lg border-border bg-app-background hover:bg-muted cursor-pointer"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
