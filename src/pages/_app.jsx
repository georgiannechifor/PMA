import '../styles/globals.css';
import {object, elementType} from 'prop-types';
import {useRouter} from 'next/router';
import {Layout} from 'components';

const MyApp = ({Component, pageProps}) => {
  const router = useRouter();

  // Use this until public / private route implementation
  const isRouterPublic = () => router.route === '/login' || router.route === '/register';


  return (
    <Layout isPublic={isRouterPublic()}>
      <Component {...pageProps} />
    </Layout>
  );
};

MyApp.propTypes = {
  Component : elementType.isRequired,
  pageProps : object.isRequired
};

MyApp.displayName = 'App';
export default MyApp;
