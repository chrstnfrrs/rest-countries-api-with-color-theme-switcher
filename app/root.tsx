import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
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
} from "@remix-run/react";
import { themePreferencesCookie } from "~/cookies.server";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;600;800&display=swap",
    rel: "stylesheet",
  },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Rest countries api with color theme switcher",
  viewport: "width=device-width,initial-scale=1,maximum-scale=1",
  description: "Frontend Mentor Project",
});

export async function loader({ request }: LoaderArgs) {
  const themePreferences = (await themePreferencesCookie.parse(
    request.headers.get("Cookie")
  )) as "light" | "dark";

  return json({ themePreferences });
}

export default function App() {
  const { themePreferences = "light" } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <html lang="en" className={`${themePreferences}`}>
      <head>
        <Meta />
        <Links />
      </head>
      <body className="font-sans bg-lightBg dark:bg-darkBg text-lightText dark:text-white">
        <nav className="flex items-center justify-between px-4 md:px-[80px] h-[80px] shadow-nav mb-12 text-lightText dark:bg-darkElement dark:text-white">
          <Link className="font-extrabold text-sm md:text-2xl" to="/">
            <strong>Where in the world?</strong>
          </Link>
          <Form method="post" action="/change-theme">
            <button
              type="submit"
              name="action"
              value="change-theme"
              className="flex items-center gap-2 text-xs md:text-base"
            >
              {themePreferences === "light" ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 md:w-5 h-4 md:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                  Dark Mode
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 md:w-5 h-4 md:h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>
            <input
              type="hidden"
              name="theme"
              value={themePreferences === "light" ? "dark" : "light"}
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
