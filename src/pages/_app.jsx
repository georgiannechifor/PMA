import '../styles/globals.css';
import {object, elementType} from 'prop-types';

const MyApp = ({Component, pageProps}) => (
  <Component {...pageProps} />
);

MyApp.propTypes = {
  Component : elementType.isRequired,
  pageProps : object.isRequired
};

MyApp.displayName = 'App';
export default MyApp;
