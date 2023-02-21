import type { LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData, useSearchParams } from '@remix-run/react';
import type { Country } from '~/repositories/countries-repository.server';
import {
  getCountries,
  getRegions,
} from '~/repositories/countries-repository.server';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';

export async function loader({ request }: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;

  const region = searchParams.get('region');
  const search = searchParams.get('search');

  const countriesRaw = await getCountries({ region });
  const regions = await getRegions();

  // Support search for country by name
  const countries = search
    ? countriesRaw.filter((country: Country) =>
        country.name.common.toLowerCase().startsWith(search.toLowerCase()),
      )
    : countriesRaw;

  return {
    countries,
    regions,
  };
}

function useDebouncedValue(value: string | null) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return debouncedValue;
}

export default function Index() {
  const { countries, regions } = useLoaderData<{
    countries: Country[];
    regions: string[];
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [region, setRegion] = useState(searchParams.get('region'));

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    if (region) {
      if (debouncedSearch) {
        setSearchParams({ search: debouncedSearch, region });
      } else {
        setSearchParams({ region });
      }
    } else {
      if (debouncedSearch) {
        setSearchParams({ search: debouncedSearch });
      } else {
        setSearchParams({});
      }
    }
  }, [region, debouncedSearch]);

  return (
    <div className='px-4 pb-6 md:px-[80px]'>
      <div className='mb-12 flex flex-wrap justify-between gap-10'>
        <div className='flex w-full max-w-[480px] items-center rounded bg-white px-8 text-lightInput shadow-search dark:bg-darkElement dark:text-white'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='h-[18px] w-[18px]'
          >
            <path
              fillRule='evenodd'
              d='M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z'
              clipRule='evenodd'
            />
          </svg>
          <input
            className='z-10 w-full bg-white py-4 pl-4 text-xs text-lightInput outline-none dark:bg-darkElement dark:text-white md:text-sm'
            placeholder='Search for a country...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Listbox value={region} onChange={setRegion}>
          <div className='relative flex'>
            <Listbox.Button className='relative flex w-full cursor-default rounded bg-white py-4 px-6 text-xs text-black shadow-search dark:bg-darkElement dark:text-white md:text-sm'>
              <span className='pr-12'>{region ?? 'Filter by Region'}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='h-2.5 w-2.5'
                >
                  <path
                    fillRule='evenodd'
                    d='M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute mt-1 w-full overflow-auto rounded bg-white py-1 text-black shadow-search dark:bg-darkElement dark:text-white'>
                {regions.map((region) => (
                  <Listbox.Option
                    key={region}
                    className='relative cursor-pointer select-none py-2 pl-6'
                    value={region}
                  >
                    {({ selected }) => (
                      <span className='block truncate text-xs md:text-sm'>
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
      <ul className='mx-auto grid w-full grid-cols-[repeat(auto-fit,_264px)] justify-center gap-16 md:justify-start'>
        {countries.map((country: Country) => (
          <li
            className='h-min min-h-full overflow-hidden rounded bg-white text-black shadow-card dark:bg-darkElement dark:text-white'
            key={country.name.official}
          >
            <Link to={`/${country.name.common}`}>
              <div className='h-[160px] w-[264px] overflow-hidden'>
                <img
                  className='h-full w-full object-cover'
                  src={country.flags.svg}
                  alt={country.flags.alt}
                  width={264}
                  height={160}
                />
              </div>
              <div className='p-6'>
                <p className='mb-4 text-lg font-extrabold'>
                  <strong>{country.name.common}</strong>
                </p>
                <ul className='flex flex-col gap-2'>
                  <li className='text-sm font-light'>
                    <strong className='font-semibold'>Population:</strong>{' '}
                    {country.population.toLocaleString()}
                  </li>
                  <li className='text-sm font-light'>
                    <strong className='font-semibold'>Region:</strong>{' '}
                    {country.region}
                  </li>
                  {!!country.capital.length && (
                    <li className='text-sm font-light'>
                      <strong className='font-semibold'>Capital:</strong>{' '}
                      {country.capital}
                    </li>
                  )}
                </ul>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
