'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  disabled = false,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label || '';
  const showSearch = options.length > 8;

  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, showSearch]);

  // Hidden input for form compatibility
  return (
    <div className="relative" ref={ref}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-2.5 border rounded-xl text-left transition-colors text-sm',
          disabled
            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:border-[#A10D5E]/40 focus:ring-2 focus:ring-[#A10D5E]/20 focus:border-[#A10D5E]',
          isOpen && 'ring-2 ring-[#A10D5E]/20 border-[#A10D5E]',
          className
        )}
      >
        <span className={cn(!value && 'text-gray-400')}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 flex-shrink-0 transition-transform duration-200',
          disabled ? 'text-gray-400' : 'text-[#A10D5E]',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {showSearch && (
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#A10D5E]/40 focus:bg-white transition-colors"
              />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin">
            {/* Opción vacía / placeholder */}
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); setSearch(''); }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors',
                !value ? 'text-[#A10D5E] bg-[#A10D5E]/5 font-medium' : 'text-gray-400 hover:bg-gray-50'
              )}
            >
              {!value && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              <span className={cn(!value ? '' : 'pl-5.5')}>{placeholder}</span>
            </button>

            {filtered.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => { onChange(option.value); setIsOpen(false); setSearch(''); }}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors',
                    isSelected
                      ? 'text-[#A10D5E] bg-[#A10D5E]/5 font-medium'
                      : 'text-gray-700 hover:bg-[#A10D5E]/5 hover:text-[#A10D5E]'
                  )}
                >
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 flex-shrink-0 text-[#A10D5E]" />
                  ) : (
                    <span className="w-3.5 flex-shrink-0" />
                  )}
                  {option.label}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-400 italic text-center">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
