import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { createCookie } from '@remix-run/node';

export const themePreferencesCookie = createCookie('theme-preferences', {
  maxAge: 604_800, // one week
});

export function loader() {
  return redirect('/');
}

export async function action({ request }: ActionArgs) {
  const currentColorScheme = await themePreferencesCookie.parse(
    request.headers.get('Cookie')
  );

  const newColorScheme = currentColorScheme === 'dark' ? null : 'dark';

  return redirect(request.url, {
    headers: {
      'Set-Cookie': await themePreferencesCookie.serialize(newColorScheme),
    },
  });
}
