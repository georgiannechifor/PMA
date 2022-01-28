import {useState} from 'react';
import {array} from 'prop-types';
import {Calendar, Loader} from 'components';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';


const Home = ({events}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Loader isLoading={false}>
      <div className="w-11/12 h-screen mx-auto rounded shadow bg-white mt-5 p-5">
        <Calendar
          events={events}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </Loader>
  );
};

Home.getInitialProps = async ctx => {
  const {data} = await getPropsFromFetch('/events', ctx);


  return {
    events : data
  };
};

Home.displayName = 'Home';
Home.propTypes = {
  events : array.isRequired
};
export default Home;
