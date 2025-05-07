import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString()
      : '';
  } catch {
    return '';
  }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const getProviderApiKey = (provider: string) => {
  switch (provider.toLowerCase()) {
    case 'openai':
      return import.meta.env.VITE_OPENAI_API_KEY || '';
    case 'claude':
    case 'anthropic':
      return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    default:
      return '';
  }
};

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
