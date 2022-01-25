import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const KnowledgeSharing = () => (
  <div>
    <h1>KnowledgeSharing Title </h1>
  </div>
);

KnowledgeSharing.getInitialProps = async (ctx) => {
  const { data } = await getPropsFromFetch('http://localhost:3000/api/events', ctx);
  return {
    events : data
  }
}

KnowledgeSharing.displayName = 'KnowledgeSharing';
KnowledgeSharing.propTypes = {};

export default KnowledgeSharing;
