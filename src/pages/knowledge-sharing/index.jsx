import {useState} from 'react';
import {useRouter} from 'next/router';
import {array} from 'prop-types';
import map from 'lodash/map';
import size from 'lodash/size';
import useSWR from 'swr';
import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {PostCard, Pagination} from 'components';
import {PAGE_SIZE, PRIVATE_PATHS} from 'constants';

const KnowledgeSharing = ({
  initialPosts
}) => {
  const {data: posts} = useSWR('/posts', {
    initialData : initialPosts
  });
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();


  return (
    <div className="w-10/12 mx-auto">
      <h1 className="text-3xl my-5 mx-10">Knowledge Sharing Title </h1>

      <div className="w-full flex justify-end">
        <button
          className="
          transition bg-blue-500 text-white rounded py-2 px-10
          font-medium mr-10 cursor-pointer -mt-3 mb-5 hover:bg-blue-600"
          onClick={() => router.push(`${PRIVATE_PATHS.KNOWLEDGE_SHARING}/create`)}
        > Add post
        </button>
      </div>

      <div className="grid grid-cols-3 justify-center items-center mx-auto gap-5 mb-10">
        {
          map(posts, post => (
            <PostCard
              author={`${post.author.firstName} ${post.author.lastName}`}
              date={post.date}
              description={post.description}
              id={post._id} // eslint-disable-line
              image={post.image}
              key={post._id} // eslint-disable-line
              title={post.title}
            />
          ))
        }
      </div>

      <div className="w-full">
        <Pagination
          currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
          totalCount={size(posts)}
        />
      </div>
    </div>
  );
};

KnowledgeSharing.getInitialProps = async ctx => {
  const {data} = await getPropsFromFetch('/posts', ctx);


  return {
    initialPosts : data || []
  };
};

KnowledgeSharing.displayName = 'KnowledgeSharing';
KnowledgeSharing.propTypes = {
  initialPosts : array.isRequired
};

export default KnowledgeSharing;
