import { ofetch } from 'ofetch';

export interface Country {
  flags: Flags;
  name: Name;
  capital: string[];
  altSpellings: string[];
  region: string;
  population: number;
}

export interface Flags {
  png: string;
  svg: string;
  alt: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface NativeName {
  isl: Isl;
}

export interface Isl {
  official: string;
  common: string;
}

// Select fields to receive from API
// https://restcountries.com/#filter-response
const filters = 'fields=name,population,region,capital,flags';

declare global {
  var countryCache: Record<string, Country[]>;
}

if (!global.countryCache) {
  global.countryCache = {};
}

export async function getCountries({ region }: { region: string | null }) {
  const key = region || 'all';

  console.log('object.keys', Object.keys(countryCache));

  if (!countryCache[key]) {
    if (key == 'all') {
      console.log('fetching');

      countryCache[key] = await ofetch(
        `https://restcountries.com/v3.1/all?${filters}`
      );
    } else {
      console.log('fetching');
      countryCache[key] = await ofetch(
        `https://restcountries.com/v3.1/region/${region}?${filters}`
      );
    }
  }

  return countryCache[key];
}
