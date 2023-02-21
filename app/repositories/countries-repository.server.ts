import { ofetch } from 'ofetch';

export interface Country {
  flags: Flags;
  name: Name;
  tld: string[];
  currencies: Record<string, Currency>;
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: Record<string, string>;
  population: number;
  borders: string[];
  cca3: string;
  cioc: string;
}

export interface Flags {
  png: string;
  svg: string;
  alt: string;
}

export interface Name {
  common: string;
  official: string;
  nativeName: Record<string, NativeName>;
}

export interface NativeName {
  official: string;
  common: string;
}
export interface Currency {
  name: string;
  symbol: string;
}

// Select fields to receive from API
// https://restcountries.com/#filter-response
const filters =
  'fields=name,population,region,subregion,capital,flags,languages,tld,currencies,borders,cca3,cioc';

declare global {
  var countriesCache: Record<string, Country[]>;
  var countryCache: Country;
  var regions: string[];
}

if (!global.countriesCache) {
  global.countriesCache = {};
}

export async function getCountries(opts?: { region: string | null }) {
  const key = opts?.region || 'all';

  if (!global.countriesCache[key]) {
    if (key == 'all') {
      global.countriesCache[key] = await ofetch(
        `https://restcountries.com/v3.1/all?${filters}`,
      );
    } else {
      global.countriesCache[key] = await ofetch(
        `https://restcountries.com/v3.1/region/${key}?${filters}`,
      );
    }
  }

  return global.countriesCache[key];
}

export async function getCountry({ countryName }: { countryName: string }) {
  if (!global.countriesCache.all) {
    await getCountries();
  }

  if (global.countryCache?.name?.common !== countryName) {
    global.countryCache = {
      ...global.countriesCache.all.find(
        (country) => country.name.common === countryName,
      ),
    } as Country;

    if (!global.countryCache) {
      return null;
    }

    global.countryCache.borders = (global.countryCache.borders as string[]).map(
      (border) =>
        (
          global.countriesCache.all.find(
            (country) => country.cca3 === border,
          ) as Country
        ).name.common,
    );
  }

  return global.countryCache;
}

export async function getRegions() {
  if (!global.countriesCache.all) {
    await getCountries();
  }

  if (!global.regions) {
    global.regions = [
      ...new Set(global.countriesCache.all.map(({ region }) => region)),
    ].sort((a, b) => a.localeCompare(b));
  }

  if (!global.countriesCache.all) {
    global.countriesCache.all = await ofetch(
      `https://restcountries.com/v3.1/all?${filters}`,
    );
  }

  return global.regions;
}
