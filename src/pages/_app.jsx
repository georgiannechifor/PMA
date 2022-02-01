import {object, elementType, string} from 'prop-types';
import {useRouter} from 'next/router';

import '../styles/globals.css';
import {Layout, AdminLayout} from 'components';
import {PUBLIC_PATHS} from 'constants/index';
import {SWRConfig} from 'swr';

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

  return (
    <PageLayout route={router.asPath}>
      <SWRConfig value={{
        fetcher : endpoint => fetch('http://localhost:3000/api' + endpoint).then(res => res.json())
          .then(res => res.data)
      }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </PageLayout>

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
