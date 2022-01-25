import {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import useLocalStorage from './useLocalStorage';
import {
  PUBLIC_PATHS,
  LOCAL_STORAGE_USER_KEY,
  STATUS_FORBIDDEN,
  STATUS_UNAUTHORIZED
} from 'constants/index';

export const useFetch = (
  endpoint
) => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [storedValue, setValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {});

  const fetchData = ( async (options) => {
    setLoading(true);
    await fetch(
      `api/${endpoint}`,
      {
        ...options,
        body : JSON.stringify(options?.data),
        headers : {
          Authorization : storedValue.accessToken || "",
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => {
        if(res.status === STATUS_FORBIDDEN || res.status === STATUS_UNAUTHORIZED) {
          setValue({});
          router.push({
            pathname: PUBLIC_PATHS.LOGIN,
            query : {
              returnUrl : router.asRoute
            }
          })
        }
        return res.json();
      })
      .then(jsonResponse => {
        if(jsonResponse.error) {
          setError(jsonResponse.error);
          setData({});
        } else {
          setData(jsonResponse.data)
        }
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      })
      .finally(() => setLoading(false))
  });

  return {
    result : {
      data,
      loading,
      error
    },
    fetchData
  };
};
