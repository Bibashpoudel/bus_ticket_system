import cookie from 'cookie';

export function parseCookies(req: any): any {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export default function getCookie(req: any, route: any) {
  const parseData = parseCookies(req);
  let userCookie = parseData.user;
  let user = null;
  console.log('getCookie', typeof userCookie);
  if (userCookie) {
    if (route == '/referrals') {
      user = JSON.parse(JSON.stringify(userCookie));
    } else {
      user = JSON.parse(userCookie);
    }
  }
  return user;
}
