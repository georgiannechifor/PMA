import '../styles/globals.css';
import {object, element} from 'prop-types';

const MyApp = ({Component, pageProps}) => (
  <Component {...pageProps} />
);

MyApp.propTypes = {
  Component : element.isRequired,
  pageProps : object.isRequired
};

MyApp.displayName = 'App';
export default MyApp;
