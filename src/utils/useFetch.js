import {useState, useEffect} from 'react';
import useLocalStorage from './useLocalStorage';
import { LOCAL_STORAGE_USER_KEY } from 'constants/index';
export const useFetch = (
  endpoint
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [storedValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY, {});

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
      .then(res => res.json())
      .then(jsonResponse => {
        if(jsonResponse.error) {
          setError(jsonResponse.error);
          setData({});
        } else {
          setData(jsonResponse)
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
