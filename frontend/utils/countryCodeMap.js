/**
 * Map calling codes to ISO country codes for libphonenumber-js
 */
export const COUNTRY_CODE_MAP = {
  '+1': 'US',
  '+1-246': 'BB',  // Barbados
  '+1-242': 'BS',  // Bahamas
  '+1-441': 'BM',  // Bermuda
  '+1-876': 'JM',  // Jamaica
  '+44': 'GB',
  '+91': 'IN',
  '+86': 'CN',
  '+81': 'JP',
  '+33': 'FR',
  '+49': 'DE',
  '+39': 'IT',
  '+34': 'ES',
  '+31': 'NL',
  '+46': 'SE',
  '+47': 'NO',
  '+41': 'CH',
  '+43': 'AT',
  '+61': 'AU',
  '+64': 'NZ',
};

/**
 * Get ISO country code from calling code
 */
export function getCountryCodeFromCallingCode(callingCode) {
  return COUNTRY_CODE_MAP[callingCode] || 'US';
}
