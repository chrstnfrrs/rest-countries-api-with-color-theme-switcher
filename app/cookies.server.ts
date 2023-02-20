import { createCookie } from '@remix-run/node';

export const themePreferencesCookie = createCookie('theme-preferences', {
  maxAge: 604_800, // one week
});
