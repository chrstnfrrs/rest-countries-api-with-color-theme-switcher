import {
  ActionArgs,
  ActionFunction,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  createCookie,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import styles from "./tailwind.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const themePreferencesCookie = createCookie("theme-preferences", {
  maxAge: 604_800, // one week
});

export async function action({ request }: ActionArgs) {
  const currentColorScheme = await themePreferencesCookie.parse(
    request.headers.get("Cookie")
  );

  const newColorScheme = currentColorScheme === "dark" ? null : "dark";

  return redirect(request.url, {
    headers: {
      "Set-Cookie": await themePreferencesCookie.serialize(newColorScheme),
    },
  });
}

export async function loader({ request }: LoaderArgs) {
  const themePreferences = await themePreferencesCookie.parse(
    request.headers.get("Cookie")
  );

  return {
    themePreferences,
  };
}

export default function App() {
  const { themePreferences } = useLoaderData<{ themePreferences?: "dark" }>();

  return (
    <html lang="en" className={themePreferences}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="flex justify-between bg-white dark:bg-slate-800">
          <div>
            <strong>Where in the world?</strong>
          </div>
          <Form method="post">
            <button type="submit">
              {themePreferences ? "Dark Mode" : "Light Mode"}
            </button>
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
