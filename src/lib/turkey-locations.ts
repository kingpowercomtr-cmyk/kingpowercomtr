import data from "@/data/turkey-locations.json";

export const TURKEY_CITIES: string[] = data.cities;

const districtsByCity: Record<string, string[]> = data.districts;

export function getDistrictsForCity(city: string): string[] {
  if (!city) return [];
  return districtsByCity[city] ?? [];
}
