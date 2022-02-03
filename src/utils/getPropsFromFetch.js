import Router from 'next/router';
import {STATUS_UNAUTHORIZED} from 'constants/index';

export async function getPropsFromFetch (url, ctx) {
  const cookie = ctx.req?.headers.cookie;
  const response = await fetch(`https://pma-ui.vercel.app/api${url}`, {
    headers : {
      cookie : cookie ?? ''
    }
  });

  if (response.status === STATUS_UNAUTHORIZED) {
    if (!ctx.req) {
      Router.replace('/login');

      return {};
    }

    ctx.res?.writeHead(302, {
      Location : '/login'
    });
    ctx.res?.end();

    return {};
  }

  const data = await response.json();

  return data || [];
}
