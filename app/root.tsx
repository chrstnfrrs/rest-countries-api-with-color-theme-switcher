import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Form,
  Link,
  useLocation,
} from '@remix-run/react';
import { themePreferencesCookie } from '~/cookies.server';

import styles from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({ request }: LoaderArgs) {
  const themePreferences = (await themePreferencesCookie.parse(
    request.headers.get('Cookie')
  )) as 'light' | 'dark';

  return json({ themePreferences });
}

export default function App() {
  const { themePreferences = 'light' } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <html lang="en" className={themePreferences}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="flex justify-between bg-white dark:bg-slate-800 dark:text-white">
          <div className="flex flex-row divide-x border-b border-b-gray-200 grow">
            <div className="p-3">
              <strong>Where in the world?</strong>
            </div>
            <Link
              className="p-3 underline hover:text-blue-800 dark:hover:text-blue-300"
              to="/"
            >
              Home
            </Link>
            <Link
              className="p-3 underline hover:text-blue-800 dark:hover:text-blue-300"
              to="/some/child/route"
            >
              Some Child Route
            </Link>
          </div>
          <Form method="post" action="/change-theme">
            <button
              type="submit"
              name="action"
              value="change-theme"
              className="p-3 border-b border-b-gray-200"
            >
              {themePreferences === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <input
              type="hidden"
              name="theme"
              value={themePreferences === 'light' ? 'dark' : 'light'}
            />
            <input
              type="hidden"
              name="returnTo"
              value={location.pathname + location.search + location.hash}
            />
          </Form>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
