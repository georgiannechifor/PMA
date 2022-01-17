import {Header, Footer} from './';
import {elementType, object, oneOfType, bool} from 'prop-types';

const Layout = ({children, isPublic}) => (isPublic ? <>
  {children}
</> : (
  <div className="flex flex-col min-h-screen">
    <Header />
    {children}
    <Footer />
  </div>
));

Layout.propTypes = {
  children : oneOfType([object, elementType]).isRequired,
  isPublic : bool
};

Layout.defaultProps = {
  isPublic : true
};
Layout.displayName = 'Layout';
export default Layout;
