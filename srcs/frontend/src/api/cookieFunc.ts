import { Cookies } from 'react-cookie'

export function getCookie(key: string): string {
  const cookies = new Cookies();

  return cookies.get(key);
}

export function setCookie(key: string, value: string): void {
  const cookies = new Cookies();

  cookies.set(key, value);
}
