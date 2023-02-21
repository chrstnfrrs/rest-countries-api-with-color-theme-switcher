import { LoaderArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import {
  Country,
  Name,
  getCountry,
} from '~/repositories/countries-repository.server';

export async function loader({ params }: LoaderArgs) {
  const countryName = params.countryName as string;
  const country = await getCountry({ countryName });

  return { country };
}

export default function Index() {
  const { country } = useLoaderData<{ country: Country }>();

  console.log('Country', country);

  const nativeName =
    country.name.nativeName[Object.keys(country.name.nativeName)[0]]?.common;

  const currencies = Object.values(country.currencies)
    .map(({ name }) => name)
    .join(', ');
  const languages = Object.values(country.languages).join(', ');

  return (
    <div className='px-7 pb-6 md:px-[80px]'>
      <Link to='/'>
        <div className='mt-10 mb-16 flex w-fit items-center gap-2 bg-white py-2 px-6 text-sm text-black shadow-back dark:bg-darkElement dark:text-white md:my-[80px] md:text-base'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='h-6 w-6'
          >
            <path
              fillRule='evenodd'
              d='M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z'
              clipRule='evenodd'
            />
          </svg>
          Back
        </div>
      </Link>
      <div className='md:tems-center flex flex-col gap-11 md:flex-row md:gap-[120px]'>
        <div className='flex-1 overflow-hidden'>
          <img
            src={country.flags.svg}
            alt={country.flags.alt}
            className='rounded md:rounded-xl'
          />
        </div>
        <div className='flex-1'>
          <h1 className='mb-4 text-3xl font-extrabold md:mb-6'>
            {country.name.common}
          </h1>
          <div className='flex flex-col gap-8 text-sm md:flex-row md:text-base'>
            <div className='flex-1'>
              {!!nativeName && (
                <p className='mb-2 font-light'>
                  <strong className='font-semibold'>Native Name:</strong>{' '}
                  {nativeName}
                </p>
              )}
              <p className='mb-2 font-light'>
                <strong className='font-semibold'>Population:</strong>{' '}
                {country.population.toLocaleString()}
              </p>
              <p className='mb-2 font-light'>
                <strong className='font-semibold'>Region:</strong>{' '}
                {country.region}
              </p>
              {!!country.subregion && (
                <p className='mb-2 font-light'>
                  <strong className='font-semibold'>Sub Region:</strong>{' '}
                  {country.subregion}
                </p>
              )}
              {!!country.capital.length && (
                <p className='mb-2 font-light'>
                  <strong className='font-semibold'>Capital:</strong>{' '}
                  {country.capital[0]}
                </p>
              )}
            </div>
            <div className='flex-1'>
              <p className='mb-2 font-light'>
                <strong className='font-semibold'>Top Level Domain:</strong>{' '}
                {country.tld[0]}
              </p>
              {!!currencies && (
                <p className='mb-2 font-light'>
                  <strong className='font-semibold'>Currencies:</strong>{' '}
                  {currencies}
                </p>
              )}
              {!!languages && (
                <p className='mb-2 font-light'>
                  <strong className='font-semibold'>Languages:</strong>{' '}
                  {languages}
                </p>
              )}
            </div>
          </div>
          {!!country.borders.length && (
            <div className='mt-8 flex flex-col gap-3 md:mt-16 md:flex-row'>
              <strong className='whitespace-nowrap pt-1 font-semibold'>
                Border Countries:{' '}
              </strong>
              <ul className='flex flex-wrap gap-3'>
                {country.borders.map((name) => (
                  <Link
                    to={`/${name}`}
                    key={name}
                    className='bg-white py-1 px-6 font-light text-black shadow-link dark:bg-darkElement dark:text-white'
                  >
                    <li>{name}</li>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
