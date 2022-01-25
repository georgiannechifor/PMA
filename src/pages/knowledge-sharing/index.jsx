import {getPropsFromFetch} from 'utils/getPropsFromFetch';

const KnowledgeSharing = () => (
  <div>
    <h1>KnowledgeSharing Title </h1>
  </div>
);

KnowledgeSharing.getInitialProps = async ctx => {
  const {data} = await getPropsFromFetch('/events', ctx);


  return {
    events : data
  };
};

KnowledgeSharing.displayName = 'KnowledgeSharing';
KnowledgeSharing.propTypes = {};

export default KnowledgeSharing;
