'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  options: FilterOption[];
  selectedValues: (string | number)[];
  onSelectionChange: (values: (string | number)[]) => void;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    icon: string;
    hover: string;
    badge: string;
    hoverBg: string;
  };
}

export function FilterDropdown({
  icon: Icon,
  label,
  description,
  options,
  selectedValues,
  onSelectionChange,
  colorScheme,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (value: string | number) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'group flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all duration-200',
          colorScheme.bg,
          colorScheme.border,
          colorScheme.hover
        )}
      >
        <Icon className={cn('w-4 h-4', colorScheme.icon)} />
        <span className={cn('text-sm font-semibold', colorScheme.text)}>{label}</span>
        {selectedValues.length > 0 && (
          <span
            className={cn(
              'flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-xs font-bold',
              colorScheme.badge
            )}
          >
            {selectedValues.length}
          </span>
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            colorScheme.icon,
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className={cn('px-4 py-3 border-b border-gray-100', colorScheme.bg)}>
            <h4 className={cn('font-semibold flex items-center gap-2', colorScheme.text)}>
              <Icon className="w-4 h-4" />
              {label}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-2">
            {options.length > 0 ? (
              options.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors group',
                    colorScheme.hoverBg
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => toggleOption(option.value)}
                    className={cn(
                      'w-5 h-5 rounded-lg border-2 border-gray-300 cursor-pointer',
                      colorScheme.text.replace('text-', 'text-')
                    )}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {option.count}
                    </span>
                  )}
                </label>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-400 italic">Sin opciones disponibles</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
