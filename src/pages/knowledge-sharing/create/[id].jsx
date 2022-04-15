import {useEffect} from 'react';
import CreatePost from './index';
import {useRouter} from 'next/router';
import {useFetch} from 'utils/useFetch';
import {Loader} from 'components';
import {USER_ROLES, LOCAL_STORAGE_USER_KEY} from 'constants';
import useLocalStorage from 'utils/useLocalStorage';
import {PRIVATE_PATHS} from 'constants/routes';

const EditPost = () => {
  const router = useRouter();
  const {id} = router.query;
  const {result: {data}, loading, fetchData} = useFetch('posts');
  const [storedValue] = useLocalStorage(LOCAL_STORAGE_USER_KEY);

  const hasUserPrivileges = () => {
    if (storedValue) {
      if (
        storedValue.jobTitle === USER_ROLES.ADMIN ||
        storedValue.jobTitle === USER_ROLES.SUPER_ADMIN) {
        return true;
      }
      if (storedValue._id === data?.author._id) { // eslint-disable-line no-underscore-dangle
        return true;
      }

      return false;
    }

    return false;
  };

  useEffect(() => {
    if (id) {
      fetchData({
        entityId : id,
        method   : 'GET'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (data) {
      if (!hasUserPrivileges()) {
        router.replace(PRIVATE_PATHS.KNOWLEDGE_SHARING);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  return (
    <Loader isLoading={loading && !hasUserPrivileges()}>
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
