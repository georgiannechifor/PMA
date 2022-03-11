import React from 'react';
import {useRouter} from 'next/router';
import {PRIVATE_PATHS} from 'constants';
import {string} from 'prop-types';

const PostCard = ({
  id,
  image,
  title,
  description,
  author,
  date
}) => {
  const router = useRouter();

  return (
    <div
      className=" cursor-pointer flex flex-col rounded-xl bg-white shadow mx-auto w-full h-full"
      onClick={() => router.push(`${PRIVATE_PATHS.KNOWLEDGE_SHARING}/${id}`)}
    >
      <div className="w-full flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Postcard image"
          className="object-cover w-full h-40 rounded-t-lg"
          src={image}
        />

      </div>

      <div className="p-5">
        <h1 className="text-xl font-medium text-gray-600 truncate"> {title} </h1>
        <p className="line-clamp-3 mt-2"> { description} </p>
      </div>

      <div className="text-gray-300 font-medium flex justify-between px-5 mb-2 mt-auto">
        <p> { author } </p>
        <p> { date} </p>
      </div>
    </div>
  );
};

PostCard.displayName = 'PostCard';
PostCard.propTypes = {
  id          : string.isRequired,
  image       : string.isRequired,
  title       : string.isRequired,
  description : string.isRequired,
  author      : string.isRequired,
  date        : string.isRequired
};

export default PostCard;
