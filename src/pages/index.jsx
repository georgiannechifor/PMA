import React from 'react';
import useSwr from 'swr';
import {fetcher} from 'utils/api';

const Home = () => {
  const {data, error} = useSwr('/api/users', fetcher);

  if (error) {
    return <h1>Could not fetch data</h1>;
  }

  return (
    <div>
      <h1>Project Management App </h1>
      {
        data && data.map(user => (
          <React.Fragment key={user.id}>
            <p>{ user.name }</p>
          </React.Fragment>
        ))
      }
    </div>
  );
};

Home.displayName = 'Home';
export default Home;
