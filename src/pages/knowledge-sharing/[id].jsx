import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import * as classnames from 'classnames';
import 'react-quill/dist/quill.bubble.css';

import {useFetch} from 'utils/useFetch';
import {Loader, PostMenu, Modal} from 'components';
import {PRIVATE_PATHS} from 'constants/routes';


const ReactQuill = dynamic(() => import('react-quill'), {ssr : false});

const Post = () => {
  const [activeMenuItem, setActiveMenuItem] = useState({});
  const [deleteModal, displayDeleteModal] = useState(false);

  const router = useRouter();
  const {
    result: {data, loading, error}, fetchData
  } = useFetch('posts'); // eslint-disable-line no-unused-vars

  useEffect(() => {
    if (router.query.id) {
      fetchData({
        entityId : router.query.id,
        method   : 'GET'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  useEffect(() => {
    if (activeMenuItem === 'edit') {
      router.push(`${PRIVATE_PATHS.KNOWLEDGE_SHARING}/create/${router.query.id}`);
    } else if (activeMenuItem === 'delete') {
      displayDeleteModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenuItem]);

  const removePost = () => {
    fetchData({
      entityId : router.query.id,
      method   : 'DELETE'
    });
  };

  useEffect(() => {
    if (data && data.deletedCount || error && error.message) {
      router.push(PRIVATE_PATHS.KNOWLEDGE_SHARING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error]);

  return (
    <Loader isLoading={loading}>
      <div className="relative w-10/12 mx-auto my-10 bg-white rounded-lg shadow-md">
        <div className="w-full mb-5 relative">
          { /* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={data?.title}
            className="object-cover object-center w-full max-h-96  rounded-t-lg"
            src={data?.image}
          />
          <div className="
               absolute w-full top-0 h-full rounded-t-lg
               bg-gray-900 bg-opacity-30
               flex items-center justify-center"
          >
            <h1 className="
                text-center
                px-5 py-2
                line-clamp-4
                text-4xl font-thin text-white"
            > {data?.title} </h1>
          </div>
        </div>
        <div
          className={classnames(`
            absolute top-5 left-5 w-10 h-10 flex bg-white rounded-full
            items-center justify-center cursor-pointer
            opacity-70 hover:opacity-100 transition`)}
        >
          <PostMenu setActiveItem={setActiveMenuItem} />
        </div>

        <div className="mx-auto w-full text-center -mt-2 text-gray-400 italic">
          <p className="font-medium not-italic text-lg"> { data?.category} </p>
          <p> Written by: <span> {data?.author.firstName} {data?.author.lastName}</span></p>
          <p> { data?.date}</p>
          <div className="border-b border-gray-500 w-1/2 mx-auto opacity-20 my-5" />
        </div>

        <div className="px-5">
          <p className="text-md my-3 text-gray-500"> { data?.description } </p>
        </div>

        <div className="">
          <ReactQuill
            readOnly
            theme="bubble"
            value={data?.content}
          />
        </div>

        <Modal
          isModalOpen={deleteModal}
          modalActions={(
            <div className="flex w-full items-center justify-end gap-2">
              <button
                className="px-8 py-2 text-sm font-medium bg-gray-100 rounded-lg focus:border-none
                 focus:outline-none hover:text-gray-400 transition"
                onClick={() => displayDeleteModal(false)}
              > Cancel </button>
              <button
                className="px-8 py-2 text-sm text-white font-medium bg-red-500
                 hover:bg-red-600 transition rounded-lg"
                onClick={() => removePost()}
              > Delete </button>
            </div>
          )}
          modalContent="Are you sure you want to delete this post?"
          modalTitle="Delete post"
          setIsModalOpen={displayDeleteModal}
        />
      </div>
    </Loader>
  );
};

Post.displayName = 'Post';
Post.propTypes = {};

export default Post;
