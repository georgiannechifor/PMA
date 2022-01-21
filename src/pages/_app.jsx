import '../styles/globals.css';
import {object, elementType} from 'prop-types';
import {useRouter} from 'next/router';
import {Layout, AdminLayout, RouterGuard} from 'components';
import {USER_ROLES, PRIVATE_PATHS, PUBLIC_PATHS} from 'constants/index';

const MyApp = ({Component, pageProps}) => {
  const router = useRouter();

  // [TDB]: take user type from API
  const currentUser = 'user';

  // Use this until public / private route implementation
  const isRouterPublic = () => Object.values(PUBLIC_PATHS).includes(router.asPath);

  const PageLayout = ({children}) => {
    if (
      currentUser === USER_ROLES.ADMIN ||
      currentUser === USER_ROLES.SUPER_ADMIN
    ) {
      if (router.route === PRIVATE_PATHS.ADMIN_CONFIG) {
        return <AdminLayout> { children }</AdminLayout>;
      }
    }

    return <Layout isPublic={isRouterPublic()}> { children }</Layout>;
  };

  PageLayout.displayName = 'PageLayout';
  PageLayout.propTypes = {children : object.isRequired};

  return (
    <RouterGuard>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </RouterGuard>
  );
};


MyApp.propTypes = {
  Component : elementType.isRequired,
  pageProps : object.isRequired
};

MyApp.displayName = 'App';
export default MyApp;
