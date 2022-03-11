import {useEffect} from 'react';
import CreatePost from './index';
import {useRouter} from 'next/router';
import {useFetch} from 'utils/useFetch';
import {Loader} from 'components';

const EditPost = () => {
  const router = useRouter();
  const {id} = router.query;
  const {result: {data}, loading, fetchData} = useFetch('posts');

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
      <CreatePost
        initialValues={data}
        isEdit
      />
    </Loader>
  );
};

EditPost.displayName = 'EditPost';
EditPost.propTypes = {};

export default EditPost;
