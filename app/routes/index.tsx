import { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import {
  Country,
  getCountries,
} from "~/repositories/countries-repository.server";

const cache = {};

export async function loader({ request }: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;

  const region = searchParams.get("region");
  const search = searchParams.get("search");

  const countriesRaw = await getCountries({ region });

  // Support search for country by name
  const countries = search
    ? countriesRaw.filter((country: Country) =>
        country.name.common.startsWith(search)
      )
    : countriesRaw;

  return {
    countries,
  };
}

export default function Index() {
  const { countries } = useLoaderData<{ countries: Country[] }>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <input
        value={searchParams.get("search") || ""}
        onChange={(e) => setSearchParams({ search: e.target.value })}
      />
      {countries.map((country: Country) => (
        <div>{JSON.stringify(country)}</div>
      ))}
    </>
  );
}
