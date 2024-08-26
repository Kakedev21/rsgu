import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const axiosHeaders = () => {
   return {
    
   }
}
export const generatePassword = () => {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  let hasUppercase = false;
  let hasLowercase = false;
  let hasNumber = false;

  while (password.length < length || !hasUppercase || !hasLowercase || !hasNumber) {
    const char = charset.charAt(Math.floor(Math.random() * charset.length));
    password += char;

    if (/[A-Z]/.test(char)) hasUppercase = true;
    if (/[a-z]/.test(char)) hasLowercase = true;
    if (/[0-9]/.test(char)) hasNumber = true;
  }

  return password;

}