
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency for display (adds commas for thousands)
export function formatCurrency(amount: number): string {
  return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Format card number with spaces every 4 digits
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 16);
  const groups = [];
  
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.substring(i, i + 4));
  }
  
  return groups.join(' ');
}

// Format expiry date as MM/YY
export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '').substring(0, 4);
  
  if (digits.length > 2) {
    return `${digits.substring(0, 2)}/${digits.substring(2)}`;
  }
  
  return digits;
}
