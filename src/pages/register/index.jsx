import {useRouter} from 'next/router';
import {ArrowCircleLeftIcon} from '@heroicons/react/outline';
import {Loader} from 'components';

const Register = () => {
  const router = useRouter();


  return (
    <Loader isLoading={false}>
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
                    className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                    id="fullname"
                    placeholder="First Name"
                    type="text"
                  />
                </div>

                <div className="flex flex-col mb-5">
                  <input
                    className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                    id="fullname"
                    placeholder="Last Name"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col mb-5">
                <input
                  autoComplete="email"
                  className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                  id="username"
                  placeholder="email@example.com"
                  type="email"
                />
              </div>

              <div className="flex flex-col mb-5">
                <input
                  autoComplete="new-password"
                  className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                  id="password"
                  placeholder="*********"
                  type="password"
                />
              </div>

              <div className="flex flex-col mb-5">
                <label className="text-sm mb-1 px-1" htmlFor="password">Confirm password</label>
                <input
                  autoComplete="new-password"
                  className="text-sm placeholder-gray-500 rounded-lg border border-gray-400 w-full py-2 px-4 focus:outline-none focus:border-blue-400"
                  id="password"
                  placeholder="*********"
                  type="password"
                />
              </div>

              <button
                className="
                self-center uppercase text-white py-1 mt-2
                bg-blue-500 hover:bg-blue-600 rounded-lg w-full
                transition duration-150
                lg:w-1/2
              "
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
