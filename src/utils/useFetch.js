import {useState, useEffect} from 'react';

export const useFetch = (
  endpoint,
  options = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    ( async () => {
      setLoading(true);
      await fetch(
        `api/${endpoint}`,
        options
      )
        .then(res => res.json())
        .then(jsonResponse => setData(jsonResponse))
        .catch(err => {
          setError(err);
          setLoading(false);
        })
        .finally(() => setLoading(false))
    })();
  }, []);

  return {
    data,
    loading,
    error
  };
};
