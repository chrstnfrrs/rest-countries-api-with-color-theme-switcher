import type { ActionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { themePreferencesCookie } from '~/cookies.server';

export function loader() {
  return redirect('/');
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const theme = formData.get('theme') ?? 'light';
  const returnTo = formData.get('returnTo')?.toString() ?? '/';

  return redirect(returnTo, {
    headers: {
      'Set-Cookie': await themePreferencesCookie.serialize(theme),
    },
  });
}
