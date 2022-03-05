import {useState} from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Import 'react-quill/dist/quill.bubble.css';

import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import * as classNames from 'classnames';
import {yupResolver} from '@hookform/resolvers/yup';
import useSWR, {useSWRConfig} from 'swr';
import map from 'lodash/map';

import {POST_CATEGORY} from 'constants';
import {ImageUpload, Select} from 'components';
import {useFetch} from 'utils/useFetch';


const ReactQuill = dynamic(() => import('react-quill'), {ssr : false});

// eslint-disable-next-line complexity
const CreatePost = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState({});
  const [contentValue, setContentValue] = useState('');
  const {fetchData} = useFetch('posts');

  const formSchema = Yup.object().shape({
    title       : Yup.string().required('Title is required'),
    description : Yup.string().required('Description is required'),
    image       : Yup.string().required('Image is required'),
    category    : Yup.string().required('Category is required'),
    content     : Yup.string().required('Content is required')
  });
  const validationOptions = {resolver : yupResolver(formSchema)};
  const {
    register,
    setValue,
    handleSubmit,
    formState: {errors}
  } = useForm(validationOptions);

  const onSubmit = formData => {
    fetchData({
      method : 'POST',
      data   : {
        ...formData,
        content : contentValue
      }
    });
  };


  return (
    <div className="w-11/12 mx-auto mt-5">

      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl my-3">Create Post</h1>

        {/* Settings for author and super admin in edit mode */}
        <div className="flex gap-x-5 my-5">
          <button className="bg-blue-400 py-1 px-12 rounded text-white"> Edit </button>
          <button className="bg-red-500 py-1 px-12 rounded text-white"> Delete </button>
        </div>

      </div>


      <div className="flex w-full flex-col gap-y-3">
        <Select
          errorClassname={errors.category ? 'border border-red-400' : ''}
          options={map(POST_CATEGORY, category => ({
            value : category,
            name  : category
          }))}
          placeholder="Post Category"
          selected={selectedCategory}
          setSelected={event => {
            setSelectedCategory(event);
            setValue('category', event.value, {shouldValidate : true});
          }}
        />
        { errors.category ? <p className="text-xs text-red-500 -mt-2 ml-2"> { errors.category.message} </p> : null}

        <input
          {...register('title')}
          className={
            classNames('flex-1 text-sm placeholder-gray-500 rounded border border-gray-300 w-full py-2 px-4 focus:outline-gray-300', {
              'border border-red-500 focus:outline-red-200' : errors.title
            })
          }
          placeholder="Title"
          type="text"
        />
        { errors.title ? <p className="text-xs text-red-500 -mt-2 ml-2"> {errors.title.message} </p> : null}
        <textarea
          {...register('description')}
          className={
            classNames('flex-1 text-sm placeholder-gray-500 rounded border border-gray-300 w-full py-2 px-4 focus:outline-gray-300', {
              'border border-red-500 focus:outline-red-200' : errors.description
            })}
          placeholder="Description"
          rows="3"
        />
        { errors.description ? <p className="text-xs text-red-500 -mt-2 ml-2"> {errors.description.message} </p> : null}

        <div className={
          classNames('flex flex-col', {
            'px-2 py-1 border border-red-500' : errors.image
          })
        }
        >
          <label className="cursor-pointer text-gray-500 mt-2 mb-1"> Upload post image</label>
          <ImageUpload
            setImageToUpload={image => {
              setImageUrl(image);
              setValue('image', image, {shouldValidate : true});
            }} {...register('image')}
          />
          { errors.image ? <p className="text-xs text-red-500 -mt-2 ml-2"> { errors.image.message} </p> : null}
        </div>

        <div className={
          classNames('bg-white', {
            'border border-red-500' : errors.content
          })
        }
        >
          <ReactQuill
            onChange={value => {
              setContentValue(value);
              setValue('content', value, {
                shouldValidate : true
              });
            }}
            theme="snow"
            value={contentValue}
          />
        </div>
        { errors.content ? <p className="text-xs text-red-500 -mt-2 ml-2"> {errors.content.message} </p> : null}

        <div className="flex justify-end w-full gap-x-5 mt-3">
          <button className="bg-red-400 rounded text-white py-2 px-12"> Discard </button>
          <button className="bg-blue-400 rounded text-white py-2 px-12" onClick={handleSubmit(onSubmit)}> Submit </button>
        </div>
      </div>
    </div>
  );
};

CreatePost.displayName = 'CreatePost';
CreatePost.propTypes = {};

export default CreatePost;
