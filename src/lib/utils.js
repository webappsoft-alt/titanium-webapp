import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const customerStatusOptions = [
  { label: "Customer", value: "C" },
  { label: "Lost Customer", value: "L" },
  { label: "Prospect", value: "P" },
  { label: "Inactive Customer", value: "I" },
  { label: "3 Month Dormant", value: "3MD" },
  { label: "6 Month Dormant", value: "6MD" },
];