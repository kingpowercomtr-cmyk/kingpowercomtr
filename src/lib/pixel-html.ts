/**
 * Admin panelden yapıştırılan piksel kodunu <script> ve <noscript> bloklarına ayırır.
 * Server-side render edilip <head> içine basılır (view-source'ta görünür).
 */
export interface ParsedPixelCode {
  scripts: string[];
  noscripts: string[];
}

export function parsePixelCode(code: string): ParsedPixelCode {
  const scripts: string[] = [];
  const noscripts: string[] = [];
  if (!code?.trim()) return { scripts, noscripts };

  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  const noscriptRegex = /<noscript\b[^>]*>([\s\S]*?)<\/noscript>/gi;

  let match: RegExpExecArray | null;
  while ((match = scriptRegex.exec(code)) !== null) {
    scripts.push(match[1].trim());
  }
  while ((match = noscriptRegex.exec(code)) !== null) {
    noscripts.push(match[1].trim());
  }

  // Hiç <script> etiketi yoksa, kodun tamamını ham script içeriği say (kullanıcı sadece JS yapıştırmış olabilir)
  if (scripts.length === 0 && noscripts.length === 0 && code.trim()) {
    scripts.push(code.trim());
  }

  return { scripts, noscripts };
}
