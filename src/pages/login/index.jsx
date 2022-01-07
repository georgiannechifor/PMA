import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {bool} from 'prop-types';

const Login = ({
  isFromPrivatePage
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isFromPrivatePage) {
      router.replace('login');
    }
  }, [isFromPrivatePage]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="
      flex flex-col
      bg-white
      shadow-md
      px-4 sm:px-6 md:px-8 lg:px-10 py-8
      rounded-xl
      w-11/12 md:w-1/2 max-w-md"
      >
        <h1 className="font-medium self-center text-xl sm:text-3xl text-gray-800">
          Welcome Back
        </h1>
        <p className="mt-4 self-center text-xl sm:text-sm text-gray-800">
          Enter your credentials to access your account
        </p>

        <div className="mt-10">
          <div>
            <div className="flex flex-col mb-5">
              <label className="text-sm mb-1 px-1" htmlFor="username">Username</label>
              <input
                className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                id="username"
                placeholder="email@example.com"
                type="text"
              />
            </div>

            <div className="flex flex-col mb-5">
              <label className="text-sm mb-1 px-1" htmlFor="username">Password</label>
              <input
                className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                id="username"
                placeholder="*********"
                type="password"
              />
            </div>

            <button className="uppercase text-white py-2 mt-2 bg-blue-500 hover:bg-blue-600 rounded-2xl w-full transition duration-150">
              Sign In
            </button>

            <div className="self-end w-full border-t mt-5 text-center">
              <p className="mt-2 hover:text-gray-500 cursor-pointer" onClick={() => router.push('/register')}> Don&apos;t have an account? </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  isFromPrivatePage : bool
};

Login.defaultProps = {
  isFromPrivatePage : false
};

Login.displayName = 'LoginPage';
export default Login;
