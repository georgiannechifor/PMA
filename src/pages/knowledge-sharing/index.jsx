import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {array} from 'prop-types';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';
import filter from 'lodash/filter';
import size from 'lodash/size';
import useSWR from 'swr';
import {PlusIcon} from '@heroicons/react/outline';

import {getPropsFromFetch} from 'utils/getPropsFromFetch';
import {PostCard, Pagination, Select, Loader} from 'components';
import {PAGE_SIZE, PRIVATE_PATHS, POST_CATEGORY} from 'constants';

const KnowledgeSharing = ({
  initialPosts
}) => {
  const {data: posts, isValidating} = useSWR('/posts', {
    initialData : initialPosts
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState({
    value : '',
    name  : 'All Categories'
  });
  const [selectedAuthor, setSelectedAuthor] = useState({
    value : '',
    name  : 'All Authors'
  });
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [authors, setAuthors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    setAuthors(map(uniqBy(posts, post => post.author._id), ({author}) => ({
      value : author._id, // eslint-disable-line no-underscore-dangle
      name  : `${author.firstName} ${author.lastName}`
    })));

    setFilteredPosts(posts);
  }, [posts]);

  console.log(isValidating);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory.value && selectedCategory.value !== '') {
      filtered = filter(posts, item => item.category === selectedCategory.value);
    }
    if (selectedAuthor.value && selectedAuthor.value !== 0) {
      // eslint-disable-next-line no-underscore-dangle
      filtered = filter(filtered, item => item.author._id === selectedAuthor.value);
    }
    setFilteredPosts(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedAuthor]);


  return (
    <Loader isLoading={isValidating}>
      <div className="w-11/12 mx-auto mt-5">
        <h1 className="text-3xl my-5">Knowledge Sharing </h1>

        <div className="w-full flex justify-between items-center gap-x-5 mb-5">
          <div className="flex gap-x-5">
            <div className="w-52">
              <Select
                options={[
                  {
                    value : '',
                    name  : 'All Categories'
                  },
                  ...map(POST_CATEGORY, category => ({
                    value : category,
                    name  : category
                  }))]}
                placeholder="Post Category"
                selected={selectedCategory}
                setSelected={event => {
                  setSelectedCategory(event);
                }}
              />
            </div>
            <div className="w-52">
              <Select
                options={[
                  {
                    value : '',
                    name  : 'All Authors'
                  },
                  ...authors]}
                placeholder="Select Author"
                selected={selectedAuthor}
                setSelected={event => {
                  setSelectedAuthor(event);
                }}
              />
            </div>
          </div>
          <button
            className="flex items-center px-5 py-2 bg-indigo-600 rounded text-white
          font-medium text-md hover:bg-indigo-700 transition"
            onClick={() => router.push(`${PRIVATE_PATHS.KNOWLEDGE_SHARING}/create`)}
          > Add article <PlusIcon className="ml-3 w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 justify-center items-center mx-auto gap-5 mb-10">
          {
            filteredPosts && filteredPosts.length ? map(filteredPosts, post => (
              <PostCard
                author={`${post.author.firstName} ${post.author.lastName}`}
                date={post.date}
                description={post.description}
              id={post._id} // eslint-disable-line
                image={post.image}
              key={post._id} // eslint-disable-line
                title={post.title}
              />
            )) : <p className="col-span-3 py-2 text-gray-400 bg-gray-200 text-center w-full"> { selectedCategory ? 'No data for current filter' : 'No data'}</p>
          }
        </div>

        <div className="w-full">
          <Pagination
            currentPage={currentPage} onPageChange={page => setCurrentPage(page)} pageSize={PAGE_SIZE}
            totalCount={size(posts)}
          />
        </div>
      </div>
    </Loader>
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
