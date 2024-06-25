import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmpty(obj: { [key: string]: any }) {
  for (let i in obj) {
    return false;
  }
  return true;
}
