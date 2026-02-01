export function normalizeString(str: string): string {
  return str
    .normalize("NFD") // Normalize to decompose combined characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .trim(); // Trim whitespace
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
}

export const extractNumber =( value:string | number ):string=>{
  if (typeof value === "number") {
    return value.toString();
  }
  const numericValue = value.replace(/\D/g, "");
  return numericValue;
};

export const extractLetter =(value:string)=>{
  return value.replace(/[^a-zA-Z]/g, "");
};

// Helper function to handle value conversion
export const formatValue = (value: string | number | boolean, type?: string): string | number | boolean => {
  if (type === "number") {
    return typeof value === "string" ? parseFloat(value.replace(/^0+(?!$)/, "")) : Number(value);
  }
  return value;
};

