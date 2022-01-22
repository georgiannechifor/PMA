import {Header, Footer} from '../';
import {any, bool} from 'prop-types';

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
  children : any.isRequired,
  isPublic : bool
};

Layout.defaultProps = {
  isPublic : true
};
Layout.displayName = 'Layout';
export default Layout;
