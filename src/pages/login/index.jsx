import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import * as cx from 'classnames';

import {useFetch} from 'utils/useFetch';
import useLocalStorage from 'utils/useLocalStorage';
import {Loader} from 'components';
import {USER_LOCAL_STORAGE_KEY} from 'constants/index';

const Login = () => {
  const formSchema = Yup.object().shape({
    email : Yup.string().email()
      .required('Email is required'),
    password : Yup.string()
      .required('Password is required')
  });
  const router = useRouter();
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {register, handleSubmit, formState: {errors}} = useForm(validationOptions);
  const {result: {data, loading, error}, fetchData} = useFetch('auth/login');
  const [, setStoredValue] = useLocalStorage(USER_LOCAL_STORAGE_KEY, {});

  const onSubmit = formData => {
    fetchData({
      method : 'POST',
      data   : {
        email    : formData.email,
        password : formData.password
      }
    });
  };


  useEffect(() => {
    if (data && data.email) { // eslint-disable-line no-underscore-dangle
      setStoredValue(data);
      router.push(router.query.returnUrl || '/');
    }
  }, [data]);

  const handlePressEnterButton = event => {
    if (event.keyCode === 13) { // eslint-disable-line no-magic-numbers
      event.preventDefault();
      document.getElementById('loginbutton').click();
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handlePressEnterButton);

    return () => {
      window.removeEventListener('keyup', handlePressEnterButton);
    };
  }, []);

  return (
    <Loader isLoading={loading}>
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
                  {...register('email')}
                  className={
                    cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                      {'border-red-500 focus:border-red-600' : Boolean(errors.email)})}
                  id="email"
                  placeholder="email@example.com"
                  type="email"
                />
                { errors.email && <span className="text-xs text-red-500 mx-2"> { errors.email.message } </span> }
              </div>

              <div className="flex flex-col mb-5">
                <input
                  {...register('password')}
                  className={
                    cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                      {'border-red-500 focus:border-red-600' : Boolean(errors.password)})}
                  id="password"
                  placeholder="*********"
                  type="password"
                />
                { errors.password && <span className="text-xs text-red-500 mx-2"> { errors.password.message} </span> }
              </div>
              { error ? <span className="text-sm text-red-500 font-medium text-center -mt-3 mb-2"> { error.message } </span> : null}

              <button
                className="
                  self-center uppercase text-white py-1 mt-2
                  bg-blue-500 hover:bg-blue-600 rounded-lg w-full
                  transition duration-150
                  lg:w-1/2
                "
                id="loginbutton"
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

Login.displayName = 'LoginPage';
export default Login;
