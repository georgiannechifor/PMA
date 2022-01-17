import {bool, elementType, object, oneOfType} from 'prop-types';

const Loader = ({isLoading, children}) => (
  <>
    { isLoading ? (
      <div className="absolute bg-black bg-opacity-30 flex items-center justify-center h-screen w-screen">
        <span className="animate-spin h-10 w-10 rounded-full border-4 border-t-blue-500" />
      </div>
    ) : null
    }
    {children}
  </>
);

Loader.propTypes = {
  isLoading : bool.isRequired,
  children  : oneOfType([elementType, object]).isRequired
};
Loader.displayName = 'Loader';
export default Loader;
