import {useState} from 'react';
import {array} from 'prop-types';
import {Calendar, Loader} from 'components';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import useSWR from 'swr';

const Home = ({events}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {data: displayEvents} = useSWR('/events', {
    initialData : events
  });

  return (
    <Loader isLoading={false}>
      <div className="relative w-11/12 h-full mx-auto rounded shadow bg-white mt-2 p-1 py-4 md:mt-5 md:p-5 md:h-screen ">
        <Calendar
          events={displayEvents}
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
Home.defaultProps = {
  events : {}
};
export default Home;
