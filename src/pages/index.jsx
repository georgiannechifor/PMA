import React from 'react';
import Calendar from 'components/calendar';

const Home = () => (
  <div>
    <h1>Project Management App </h1>

    <div className="bg-white p-5 flex flex-col items-center justify-center">
      <Calendar />
    </div>
  </div>
);

Home.displayName = 'Home';
export default Home;
