import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {bool} from 'prop-types';
import {useForm} from 'react-hook-form';
import * as cx from 'classnames';

import {Loader} from 'components';

const Login = ({
  isFromPrivatePage
}) => {
  const router = useRouter();
  const {register, handleSubmit, formState: {errors}} = useForm();

  const onSubmit = data => console.log(data); //eslint-disable-line

  useEffect(() => {
    if (isFromPrivatePage) {
      router.replace('login');
    }
  }, [isFromPrivatePage]);

  return (
    <Loader isLoading={false}>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="
        flex flex-col
        bg-white
        shadow-md
        px-4 sm:px-6 md:px-8 lg:px-10 py-8
        rounded-xl
        w-11/12 md:w-1/2 max-w-md"
        >
          <h1 className="font-medium self-center text-2xl text-gray-800 sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-4 self-center text-lg text-gray-800 text-center sm:text-sm">
            Enter your credentials to access your account
          </p>

          <div className="mt-8">
            <div className="flex flex-col w-full">
              <div className="flex flex-col mb-5">
                <input
                  {...register('username', {required : true})}
                  className={
                    cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                      {'border-red-500 focus:border-red-600' : Boolean(errors.username)})}
                  id="username"
                  placeholder="email@example.com"
                  type="email"
                />
                { errors.username && <span className="text-xs text-red-500 mx-2"> Username field is required </span> }
              </div>

              <div className="flex flex-col mb-5">
                <input
                  {...register('password', {required : true})}
                  className={
                    cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                      {'border-red-500 focus:border-red-600' : Boolean(errors.password)})}
                  id="password"
                  placeholder="*********"
                  type="password"
                />
                { errors.password && <span className="text-xs text-red-500 mx-2"> Password field is required </span> }
              </div>

              <button
                className="
                  self-center uppercase text-white py-1 mt-2
                  bg-blue-500 hover:bg-blue-600 rounded-lg w-full
                  transition duration-150
                  lg:w-1/2
                "
                onClick={handleSubmit(onSubmit)}
                type="submit"
              >
                Sign In
              </button>

              <div className="flex justify-between self-end w-full border-t mt-5 text-center">
                <p
                  className="mt-2 hover:text-gray-500 cursor-pointer text-sm"
                  onClick={() => router.push('/forgot-password')}
                > Forgot your password? </p>
                <p
                  className="mt-2 hover:text-gray-500 cursor-pointer text-sm"
                  onClick={() => router.push('/register')}
                > Don&apos;t have an account? </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loader>
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
