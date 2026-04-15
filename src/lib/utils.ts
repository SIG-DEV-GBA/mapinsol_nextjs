import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStudyPublicationDate(value: string | undefined | null): string {
  if (!value) return '';

  const raw = value.trim();
  if (!raw) return '';

  const isoLike = raw.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})(?:[T\s].*)?$/);
  if (isoLike) {
    const [, year, month, day] = isoLike;
    return `${day}/${month}/${year}`;
  }

  return raw;
}
