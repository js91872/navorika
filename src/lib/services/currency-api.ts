// Free currency API - using exchangerate-api.com (no key needed for limited usage)
// For production, consider using a paid API with higher limits

const API_URL = "https://api.exchangerate-api.com/v4/latest";
const FALLBACK_API = "https://api.frankfurter.app/latest";

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export async function fetchExchangeRates(base: string): Promise<ExchangeRateResponse> {
  try {
    // Try the primary API
    const response = await fetch(`${API_URL}/${base}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.log("Primary API failed, trying fallback...", error);
    
    // Try fallback API
    try {
      const response = await fetch(`${FALLBACK_API}?from=${base}`);
      if (!response.ok) throw new Error(`Fallback API error: ${response.status}`);
      const data = await response.json();
      
      // Convert Frankfurter API response to our format
      return {
        base: data.base,
        date: data.date,
        rates: data.rates,
      };
    } catch (fallbackError) {
      console.error("Both APIs failed:", fallbackError);
      throw new Error("Unable to fetch exchange rates. Please try again later.");
    }
  }
}

export async function fetchHistoricalRates(
  from: string, 
  to: string, 
  days: number = 30
): Promise<HistoricalRate[]> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await fetch(
      `${FALLBACK_API}/${startDate.toISOString().split('T')[0]}..${endDate.toISOString().split('T')[0]}?from=${from}&to=${to}`
    );
    
    if (!response.ok) throw new Error(`Historical API error: ${response.status}`);
    const data = await response.json();
    
    const rates: HistoricalRate[] = [];
    for (const [date, rate] of Object.entries(data.rates)) {
      rates.push({
        date,
        rate: (rate as any)[to] || 0,
      });
    }
    
    return rates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error("Failed to fetch historical rates:", error);
    return [];
  }
}
