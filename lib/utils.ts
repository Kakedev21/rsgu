import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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


export const base64ToFile = (base64String: any, filename: string) => {
  // Split the Base64 string into parts
  const [header, data] = base64String.split(',');
  const mime = header?.match(/:(.*?);/)[1]; // Extract MIME type

  // Decode the Base64 string
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  // Create a Uint8Array from the byte numbers
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: mime });
  return blob;
}

