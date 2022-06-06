import {object, elementType, string} from 'prop-types';
import {useRouter} from 'next/router';

import '../styles/globals.scss';
import {Layout, AdminLayout, Loader} from 'components';
import {PUBLIC_PATHS} from 'constants/index';
import {SWRConfig} from 'swr';
import {useEffect, useState} from 'react';

const PageLayout = ({children, route}) => {
  if (route && route.includes('/admin-config')) {
    return (
      <AdminLayout>
        { children }
      </AdminLayout>
    );
  }

  return (
    <Layout
      isPublic={Object.values(PUBLIC_PATHS).includes(route)}
    > { children }
    </Layout>
  );
};

const App = ({Component, pageProps}) => {
  const router = useRouter();
  const [loaderScreen, setLoaderScreen] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoaderScreen(true);
    const handleStop = () => setLoaderScreen(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <Loader isLoading={loaderScreen}>
      <PageLayout route={router.asPath}>
        <SWRConfig value={{
          fetcher : endpoint => fetch(`${process.env.ORIGIN_URL}/api` + endpoint).then(res => res.json())
            .then(res => res.data)
        }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </PageLayout>
    </Loader>

  );
};


PageLayout.displayName = 'PageLayout';
PageLayout.propTypes = {
  children : object.isRequired,
  route    : string.isRequired
};

App.propTypes = {
  Component : elementType.isRequired,
  pageProps : object.isRequired
};
App.displayName = 'App';
export default App;
