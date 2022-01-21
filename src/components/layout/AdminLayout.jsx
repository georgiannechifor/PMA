import {Header, Footer} from '../';
import {elementType, object, oneOfType, bool} from 'prop-types';

const AdminLayout = ({children, isPublic}) => (isPublic ? <>
  {children}
</> : (
  <div className="flex flex-col min-h-screen">
    <Header />
    {children}
    <Footer />
  </div>
));

AdminLayout.propTypes = {
  children : oneOfType([object, elementType]).isRequired,
  isPublic : bool
};

AdminLayout.defaultProps = {
  isPublic : true
};
AdminLayout.displayName = 'Layout';
export default AdminLayout;
