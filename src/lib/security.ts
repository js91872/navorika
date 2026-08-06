export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  allowedKeys: (keyof T)[]
): Record<string, any> {
  const result: Record<string, any> = {};
  allowedKeys.forEach((key) => {
    if (obj[key] !== undefined) {
      result[key as string] = obj[key];
    }
  });
  return result;
}
