import { useEffect } from 'react';
import {useRouter} from 'next/router';
import {ArrowCircleLeftIcon} from '@heroicons/react/outline';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import * as cx from 'classnames';

import {useFetch} from 'utils/useFetch';
import useLocalStorage from 'utils/useLocalStorage';
import {USER_ROLES, LOCAL_STORAGE_USER_KEY} from 'constants/index';
import {Loader} from 'components';

const Register = () => {
  const router = useRouter();

  const formSchema = Yup.object().shape({
    firstName : Yup.string()
      .required('First name is required'),
    lastName : Yup.string()
      .required('Last name is required'),
    email : Yup.string().email()
      .required('Email is required'),
    password : Yup.string()
      .required('Password is required')
      .min(4, 'Password length should be at least 4 characters'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match')
  });

  const validationOptions = { resolver : yupResolver(formSchema)};

  const {register, handleSubmit, formState: {errors}} = useForm(validationOptions);
  const {result: {data, loading, error}, fetchData} = useFetch('/auth/register');
  const [storedValue, setValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {}); // eslint-disable-line no-unused-vars

  const onSubmit = formData => {
    fetchData({
      method : 'POST',
      data   : {
        ...formData,
        jobTitle : USER_ROLES.USER,
      }
    });
  };

  useEffect(() => {
    if (data?.accessToken) {
      setValue({
        accessToken : data.accessToken,
        user        : data.data
      });
    }
  }, [data]);

  useEffect(() => {
    if(storedValue && storedValue.accessToken) {
      router.push('/');
    }
  }, [storedValue])

  return (
    <Loader isLoading={loading}>
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="
      flex flex-col
      bg-white
      shadow-md
      px-4 sm:px-6 md:px-8 lg:px-10 py-8
      rounded-xl
      w-11/12 md:w-1/2 max-w-md"
        >
          <h1 className="font-medium self-center text-xl text-gray-800 text-2xl sm:text-3xl">
            Welcome!
          </h1>
          <p className="mt-4 self-center text-lg text-gray-800 text-center sm:text-sm">
            Enter your detais to create a new account
          </p>

          <div className="mt-8">
            <div className="flex flex-col w-full">
              <div className="flex gap-3 items-center justify-center">
                <div className="flex flex-col mb-5">
                  <input
                    {...register('firstName')}
                    className={
                      cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                        {'relative border-red-500 focus:border-red-600' : Boolean(errors.firstName)})}
                    id="firstName"
                    placeholder="First Name"
                    type="text"
                  />
                { errors.firstName && <span className=" text-xs text-red-500 mx-2"> { errors.firstName.message } </span> }
                </div>

                <div className="flex flex-col mb-5">
                  <input
                    {...register('lastName')}
                    className={
                      cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                        {'relative border-red-500 focus:border-red-600' : Boolean(errors.lastName)})}
                    id="lastName"
                    placeholder="Last Name"
                    type="text"
                  />
                 { errors.lastName && <span className=" text-xs text-red-500 mx-2"> { errors.lastName.message } </span> }
                </div>
              </div>

              <div className="flex flex-col mb-5">
                <input
                  {...register('email')}
                  autoComplete="off"
                  className={
                    cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                      {'relative border-red-500 focus:border-red-600' : Boolean(errors.email)})}
                  id="username"
                  placeholder="email@example.com"
                  type="email"
                />
              { errors.email && <span className=" text-xs text-red-500 mx-2"> { errors.email.message } </span> }
              </div>

              <div className="flex flex-col mb-5">
                <input
                  {...register('password')}
                  autoComplete="new-password"
                  className={
                    cx('text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400',
                      {'relative border-red-500 focus:border-red-600' : Boolean(errors.password)})}
                  id="password"
                  placeholder="*********"
                  type="password"
                />
              { errors.password && <span className=" text-xs text-red-500 mx-2"> { errors.password.message } </span> }
              </div>

              <div className="flex flex-col mb-5">
                <label className="text-sm mb-1 px-1" htmlFor="password">Confirm password</label>
                <input
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                  className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                  id="confirmPassword"
                  placeholder="*********"
                  type="password"
                />
              { errors.confirmPassword && <span className=" text-xs text-red-500 mx-2"> { errors.confirmPassword.message } </span> }
              </div>

              <button
                className="
                self-center uppercase text-white py-1 mt-2
                bg-blue-500 hover:bg-blue-600 rounded-lg w-full
                transition duration-150
                lg:w-1/2
              "
                onClick={handleSubmit(onSubmit)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0">
          <ArrowCircleLeftIcon
            className="cursor-pointer text-gray-800 hover:text-gray-700 transition w-10 h-10 m-5"
            onClick={() => router.back()}
          />
        </div>
      </div>
    </Loader>
  );
};

Register.displayName = 'RegisterPage';
export default Register;
