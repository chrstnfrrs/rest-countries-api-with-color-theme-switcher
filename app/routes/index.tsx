import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import type { Country } from "~/repositories/countries-repository.server";
import {
  getCountries,
  getRegions,
} from "~/repositories/countries-repository.server";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

export async function loader({ request }: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;

  const region = searchParams.get("region");
  const search = searchParams.get("search");

  const countriesRaw = await getCountries({ region });
  const regions = await getRegions();

  // Support search for country by name
  const countries = search
    ? countriesRaw.filter((country: Country) =>
        country.name.common.toLowerCase().startsWith(search.toLowerCase())
      )
    : countriesRaw;

  return {
    countries,
    regions,
  };
}

export default function Index() {
  const { countries, regions } = useLoaderData<{
    countries: Country[];
    regions: string[];
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const region = searchParams.get("region");
  const search = searchParams.get("search");

  const setRegion = (e: string) => {
    if (search) {
      setSearchParams({ search, region: e });
    } else {
      setSearchParams({ region: e });
    }
  };

  const setSearch = (newSearch: string) => {
    if (region) {
      if (newSearch) {
        setSearchParams({ search: newSearch, region });
      } else {
        setSearchParams({ region });
      }
    } else {
      if (newSearch) {
        setSearchParams({ search: newSearch });
      } else {
        setSearchParams({});
      }
    }
  };

  return (
    <div className="px-4 md:px-[80px] pb-6">
      <div className="flex justify-between flex-wrap mb-12 gap-10">
        <div className="flex items-center shadow-search max-w-[480px] w-full px-8 rounded bg-white text-lightInput dark:bg-darkElement dark:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[18px] h-[18px]"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
              clipRule="evenodd"
            />
          </svg>
          <input
            className="py-4 pl-4 outline-none z-10 w-full bg-white text-lightInput dark:bg-darkElement dark:text-white text-xs md:text-sm"
            placeholder="Search for a country..."
            value={searchParams.get("search") || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Listbox value={region} onChange={setRegion}>
          <div className="relative flex">
            <Listbox.Button className="relative flex w-full cursor-default py-4 px-6 rounded shadow-search bg-white text-black dark:bg-darkElement dark:text-white text-xs md:text-sm">
              <span className="pr-12">{region ?? "Filter by Region"}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-2.5 h-2.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded bg-white text-black dark:bg-darkElement dark:text-white py-1 shadow-search">
                {regions.map((region) => (
                  <Listbox.Option
                    key={region}
                    className="relative cursor-pointer select-none py-2 pl-6"
                    value={region}
                  >
                    {({ selected }) => (
                      <span className="block truncate text-xs md:text-sm">
                        {region}
                      </span>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,_264px)] justify-center md:justify-start gap-16 w-full mx-auto">
        {countries.map((country: Country) => (
          <li
            className="rounded shadow-card bg-white text-black dark:bg-darkElement dark:text-white overflow-hidden h-min"
            key={country.name.official}
          >
            <Link to={`/${country.name.common}`}>
              <div className="w-[264px] max-h-[160px] h-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={country.flags.svg}
                  alt={country.flags.alt}
                  width={264}
                  height={160}
                />
              </div>
              <div className="p-6">
                <p className="font-extrabold text-lg mb-4">
                  <strong>{country.name.common}</strong>
                </p>
                <ul className="flex flex-col gap-2">
                  <li>
                    <p className="text-sm font-light">
                      <strong className="font-semibold">Population:</strong>{" "}
                      {country.population.toLocaleString()}
                    </p>
                  </li>
                  <li className="text-sm">
                    <p className="font-light">
                      <strong className="font-semibold">Region:</strong>{" "}
                      {country.region}
                    </p>
                  </li>
                  <li className="text-sm">
                    <p className="font-light">
                      <strong className="font-semibold">Capital:</strong>{" "}
                      {country.capital}
                    </p>
                  </li>
                </ul>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
