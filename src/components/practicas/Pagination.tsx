'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  return (
    <div className="mt-16 flex justify-center">
      <div className="inline-flex items-center gap-3">
        <NavButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          icon={<ChevronsLeft className="w-5 h-5" />}
        />

        <NavButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft className="w-5 h-5" />}
          label="Anterior"
        />

        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, idx) =>
            typeof page === 'number' ? (
              <PageButton
                key={idx}
                page={page}
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              />
            ) : (
              <span key={idx} className="px-2 text-gray-400">
                {page}
              </span>
            )
          )}
        </div>

        <NavButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight className="w-5 h-5" />}
          label="Siguiente"
          labelFirst
        />

        <NavButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          icon={<ChevronsRight className="w-5 h-5" />}
        />
      </div>
    </div>
  );
}

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label?: string;
  labelFirst?: boolean;
}

function NavButton({ onClick, disabled, icon, label, labelFirst }: NavButtonProps) {
  const baseClasses = cn(
    'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all',
    disabled
      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
      : 'border-gray-200 text-gray-700 hover:border-[#FF6900] hover:text-[#FF6900]'
  );

  return (
    <button onClick={onClick} disabled={disabled} className={baseClasses}>
      {labelFirst && label && <span className="hidden sm:inline">{label}</span>}
      {icon}
      {!labelFirst && label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-10 h-10 rounded-xl font-medium transition-all',
        isActive
          ? 'bg-[#FF6900] text-white'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      {page}
    </button>
  );
}
