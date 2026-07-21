/**
 * Get user's currency based on location
 * Uses browser's locale to determine the currency
 */
export function getUserCurrency(): string {
  if (typeof window === 'undefined') return 'USD'; // Server-side fallback
  
  try {
    // Get user's locale from browser
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    
    // Map locales to currencies - Complete mapping
    const localeCurrencyMap: Record<string, string> = {
      // Americas
      'en-US': 'USD',
      'en-CA': 'CAD',
      'fr-CA': 'CAD',
      'es-MX': 'MXN',
      'pt-BR': 'BRL',
      'es-AR': 'ARS',
      'es-CL': 'CLP',
      'es-CO': 'COP',
      'es-PE': 'PEN',
      'es-VE': 'VES',
      
      // Europe
      'en-GB': 'GBP',
      'en-IE': 'EUR',
      'de-DE': 'EUR',
      'fr-FR': 'EUR',
      'it-IT': 'EUR',
      'es-ES': 'EUR',
      'pt-PT': 'EUR',
      'nl-NL': 'EUR',
      'pl-PL': 'PLN',
      'sv-SE': 'SEK',
      'no-NO': 'NOK',
      'da-DK': 'DKK',
      'fi-FI': 'EUR',
      'cs-CZ': 'CZK',
      'hu-HU': 'HUF',
      'ro-RO': 'RON',
      'bg-BG': 'BGN',
      'el-GR': 'EUR',
      'hr-HR': 'EUR',
      'sk-SK': 'EUR',
      'si-SI': 'EUR',
      'lt-LT': 'EUR',
      'lv-LV': 'EUR',
      'et-EE': 'EUR',
      
      // Asia
      'en-IN': 'INR',
      'hi-IN': 'INR',
      'mr-IN': 'INR',
      'ta-IN': 'INR',
      'te-IN': 'INR',
      'kn-IN': 'INR',
      'ml-IN': 'INR',
      'bn-IN': 'INR',
      'gu-IN': 'INR',
      'or-IN': 'INR',
      'pa-IN': 'INR',
      'en-PK': 'PKR',
      'ur-PK': 'PKR',
      'en-BD': 'BDT',
      'bn-BD': 'BDT',
      'en-LK': 'LKR',
      'si-LK': 'LKR',
      'ta-LK': 'LKR',
      'en-NP': 'NPR',
      'ne-NP': 'NPR',
      'en-AE': 'AED',
      'ar-AE': 'AED',
      'en-SA': 'SAR',
      'ar-SA': 'SAR',
      'en-KW': 'KWD',
      'ar-KW': 'KWD',
      'en-QA': 'QAR',
      'ar-QA': 'QAR',
      'en-BH': 'BHD',
      'ar-BH': 'BHD',
      'en-OM': 'OMR',
      'ar-OM': 'OMR',
      'en-JO': 'JOD',
      'ar-JO': 'JOD',
      'en-EG': 'EGP',
      'ar-EG': 'EGP',
      'en-MA': 'MAD',
      'ar-MA': 'MAD',
      'en-TN': 'TND',
      'ar-TN': 'TND',
      'en-DZ': 'DZD',
      'ar-DZ': 'DZD',
      'en-LY': 'LYD',
      'ar-LY': 'LYD',
      'en-SD': 'SDG',
      'ar-SD': 'SDG',
      'en-ET': 'ETB',
      'am-ET': 'ETB',
      'en-KE': 'KES',
      'sw-KE': 'KES',
      'en-TZ': 'TZS',
      'sw-TZ': 'TZS',
      'en-UG': 'UGX',
      'sw-UG': 'UGX',
      'en-NG': 'NGN',
      'ha-NG': 'NGN',
      'yo-NG': 'NGN',
      'ig-NG': 'NGN',
      'en-ZA': 'ZAR',
      'af-ZA': 'ZAR',
      'zu-ZA': 'ZAR',
      'xh-ZA': 'ZAR',
      'en-GH': 'GHS',
      'en-CM': 'XAF',
      'en-CI': 'XOF',
      'en-SN': 'XOF',
      'en-ML': 'XOF',
      'en-BF': 'XOF',
      'en-NE': 'XOF',
      'en-TG': 'XOF',
      'en-BJ': 'XOF',
      'en-GM': 'GMD',
      'en-SL': 'SLL',
      'en-LR': 'LRD',
      'en-MW': 'MWK',
      'en-ZM': 'ZMW',
      'en-ZW': 'ZWL',
      'en-NA': 'NAD',
      'en-BW': 'BWP',
      'en-LS': 'LSL',
      'en-SZ': 'SZL',
      'en-MU': 'MUR',
      'en-SC': 'SCR',
      'en-KM': 'KMF',
      'en-MG': 'MGA',
      'en-RE': 'EUR',
      'en-YT': 'EUR',
      
      // East Asia
      'ja-JP': 'JPY',
      'ko-KR': 'KRW',
      'zh-CN': 'CNY',
      'zh-TW': 'TWD',
      'zh-HK': 'HKD',
      'en-SG': 'SGD',
      'zh-SG': 'SGD',
      'ms-MY': 'MYR',
      'en-MY': 'MYR',
      'en-PH': 'PHP',
      'fil-PH': 'PHP',
      'tl-PH': 'PHP',
      'en-VN': 'VND',
      'vi-VN': 'VND',
      'en-TH': 'THB',
      'th-TH': 'THB',
      'en-ID': 'IDR',
      'id-ID': 'IDR',
      'en-MM': 'MMK',
      'my-MM': 'MMK',
      'en-KH': 'KHR',
      'km-KH': 'KHR',
      'en-LA': 'LAK',
      'lo-LA': 'LAK',
      
      // Oceania
      'en-AU': 'AUD',
      'en-NZ': 'NZD',
      'en-FJ': 'FJD',
      'en-PG': 'PGK',
      'en-SB': 'SBD',
      'en-VU': 'VUV',
      'en-WS': 'WST',
      'en-TO': 'TOP',
      
      // Middle East
      'en-IL': 'ILS',
      'he-IL': 'ILS',
      'ar-IL': 'ILS',
      'en-TR': 'TRY',
      'tr-TR': 'TRY',
      'en-IR': 'IRR',
      'fa-IR': 'IRR',
      'en-IQ': 'IQD',
      'ar-IQ': 'IQD',
      'en-SY': 'SYP',
      'ar-SY': 'SYP',
      'en-LB': 'LBP',
      'ar-LB': 'LBP',
      'en-YE': 'YER',
      'ar-YE': 'YER',
      'en-PS': 'ILS',
      'ar-PS': 'ILS',
      
      // Russia & Central Asia
      'ru-RU': 'RUB',
      'ru-KZ': 'KZT',
      'kk-KZ': 'KZT',
      'en-KZ': 'KZT',
      'ru-UZ': 'UZS',
      'uz-UZ': 'UZS',
      'en-UZ': 'UZS',
      'ru-TM': 'TMT',
      'tk-TM': 'TMT',
      'en-TM': 'TMT',
      'ru-KG': 'KGS',
      'ky-KG': 'KGS',
      'en-KG': 'KGS',
      'ru-TJ': 'TJS',
      'tg-TJ': 'TJS',
      'en-TJ': 'TJS',
      'ru-AZ': 'AZN',
      'az-AZ': 'AZN',
      'en-AZ': 'AZN',
      'ru-GE': 'GEL',
      'ka-GE': 'GEL',
      'en-GE': 'GEL',
      'ru-AM': 'AMD',
      'hy-AM': 'AMD',
      'en-AM': 'AMD',
      
      // Default for common locales
      'en': 'USD',
      'hi': 'INR',
      'fr': 'EUR',
      'de': 'EUR',
      'es': 'EUR',
      'pt': 'EUR',
      'it': 'EUR',
      'nl': 'EUR',
      'pl': 'PLN',
      'sv': 'SEK',
      'no': 'NOK',
      'da': 'DKK',
      'fi': 'EUR',
      'cs': 'CZK',
      'hu': 'HUF',
      'ro': 'RON',
      'bg': 'BGN',
      'el': 'EUR',
      'hr': 'EUR',
      'sk': 'EUR',
      'sl': 'EUR',
      'lt': 'EUR',
      'lv': 'EUR',
      'et': 'EUR',
      'ja': 'JPY',
      'ko': 'KRW',
      'zh': 'CNY',
      'ru': 'RUB',
      'ar': 'AED',
      'ur': 'PKR',
      'bn': 'BDT',
      'ta': 'INR',
      'te': 'INR',
      'ml': 'INR',
      'kn': 'INR',
      'gu': 'INR',
      'mr': 'INR',
      'or': 'INR',
      'pa': 'INR',
      'ne': 'NPR',
      'si': 'LKR',
      'km': 'KHR',
      'lo': 'LAK',
      'my': 'MMK',
      'th': 'THB',
      'vi': 'VND',
      'id': 'IDR',
      'ms': 'MYR',
      'fil': 'PHP',
      'tl': 'PHP',
      'sw': 'KES',
      'am': 'ETB',
      'ha': 'NGN',
      'yo': 'NGN',
      'ig': 'NGN',
      'af': 'ZAR',
      'zu': 'ZAR',
      'xh': 'ZAR',
      'kk': 'KZT',
      'uz': 'UZS',
      'tk': 'TMT',
      'ky': 'KGS',
      'tg': 'TJS',
      'az': 'AZN',
      'ka': 'GEL',
      'hy': 'AMD',
    };
    
    // Check if we have a mapping for this exact locale
    if (localeCurrencyMap[locale]) {
      return localeCurrencyMap[locale];
    }
    
    // Check if we have a mapping for the language code only
    const languageCode = locale.split('-')[0];
    if (localeCurrencyMap[languageCode]) {
      return localeCurrencyMap[languageCode];
    }
    
    // Try to get currency from Intl.NumberFormat
    try {
      const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
      const parts = formatter.formatToParts(0);
      const currencyPart = parts.find(part => part.type === 'currency');
      if (currencyPart) {
        return currencyPart.value;
      }
    } catch {
      // Fallback to USD
    }
    
    return 'USD'; // Default fallback
  } catch {
    return 'USD'; // Default fallback
  }
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    RUB: '₽',
    BRL: 'R$',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'Fr',
    SGD: 'S$',
    MYR: 'RM',
    PHP: '₱',
    PKR: '₨',
    BDT: '৳',
    LKR: 'Rs',
    NPR: 'Rs',
    AED: 'د.إ',
    SAR: '﷼',
    KWD: 'د.ك',
    QAR: '﷼',
    BHD: 'د.ب',
    OMR: '﷼',
    JOD: 'د.ا',
    EGP: 'E£',
    ZAR: 'R',
    NGN: '₦',
    KES: 'KSh',
    TZS: 'TSh',
    UGX: 'USh',
    GHS: 'GH₵',
    MAD: 'DH',
    TND: 'DT',
    DZD: 'DA',
    LYD: 'LD',
    SDG: 'SDG',
    ETB: 'Br',
    XAF: 'FCFA',
    XOF: 'CFA',
    GMD: 'D',
    SLL: 'Le',
    LRD: 'L$',
    MWK: 'MK',
    ZMW: 'ZK',
    ZWL: 'Z$',
    NAD: 'N$',
    BWP: 'P',
    LSL: 'L',
    SZL: 'E',
    MUR: 'Rs',
    SCR: 'Rs',
    KMF: 'CF',
    MGA: 'Ar',
    GYD: 'G$',
    SRD: 'SR$',
    BZD: 'BZ$',
    GTQ: 'Q',
    HNL: 'L',
    NIO: 'C$',
    CRC: '₡',
    PAB: 'B/.',
    DOP: 'RD$',
    CUP: '₱',
    JMD: 'J$',
    TTD: 'TT$',
    BBD: 'Bds$',
    BSD: 'B$',
    KYD: 'CI$',
    XCD: 'EC$',
    BMD: 'BD$',
    FKP: 'FK£',
    SHP: 'SH£',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    VES: 'Bs',
    PLN: 'zł',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    ILS: '₪',
    TRY: '₺',
    IRR: '﷼',
    IQD: 'ع.د',
    SYP: '£S',
    LBP: 'ل.ل',
    YER: '﷼',
    KZT: '₸',
    UZS: 'soʻm',
    TMT: 'm',
    KGS: 'som',
    TJS: 'SM',
    AZN: '₼',
    GEL: '₾',
    AMD: '֏',
    MMK: 'K',
    KHR: '៛',
    LAK: '₭',
    VND: '₫',
    IDR: 'Rp',
    THB: '฿',
    FJD: 'FJ$',
    PGK: 'K',
    SBD: 'SI$',
    VUV: 'VT',
    WST: 'WS$',
    TOP: 'T$',
  };
  
  return symbols[currencyCode] || currencyCode;
}

/**
 * Format currency based on user's locale
 */
export function formatCurrency(amount: number, currencyCode?: string): string {
  if (typeof window === 'undefined') {
    // Server-side fallback - try to use USD
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `$${amount.toLocaleString()}`;
    }
  }
  
  try {
    const locale = navigator.language || navigator.languages?.[0] || 'en-US';
    const currency = currencyCode || getUserCurrency();
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback to USD
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `$${amount.toLocaleString()}`;
    }
  }
}
