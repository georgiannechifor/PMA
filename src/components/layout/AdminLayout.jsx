import {AdminMenu, Header, Footer} from '../';
import {elementType, object, oneOfType} from 'prop-types';

const AdminLayout = ({children}) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex w-full min-h-screen">
      <AdminMenu />
      {children}
    </div>
    <Footer />
  </div>
);

AdminLayout.propTypes = {
  children : oneOfType([object, elementType]).isRequired
};


AdminLayout.displayName = 'AdminLayout';
export default AdminLayout;
