export const PHONE_DIGIT_LENGTH = 10;

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, PHONE_DIGIT_LENGTH);
}

/** 10 hane, 5 ile başlar — örn. 5468823229 */
export function isValidTurkishMobile(phone: string): boolean {
  const digits = sanitizePhoneInput(phone);
  return /^5\d{9}$/.test(digits);
}
