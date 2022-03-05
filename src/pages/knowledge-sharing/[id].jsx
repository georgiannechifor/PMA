import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useFetch} from 'utils/useFetch';
import {Loader} from 'components';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.bubble.css';


const ReactQuill = dynamic(() => import('react-quill'), {ssr : false});

const Post = () => {
  const {query : {id}} = useRouter();
  const {
    result: {data, loading, error}, fetchData
  } = useFetch('posts'); // eslint-disable-line no-unused-vars

  useEffect(() => {
    if (id) {
      fetchData({
        entityId : id,
        method   : 'GET'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  return (
    <Loader isLoading={loading}>
      <div className="w-10/12 mx-auto my-10 bg-white rounded-lg shadow-md">
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
      </div>
    </Loader>
  );
};

Post.displayName = 'Post';
Post.propTypes = {};

export default Post;
