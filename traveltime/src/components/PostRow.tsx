import Likes from './Likes';
import {PostWithOwner} from '../types/LocalTypes';
import {useNavigate} from 'react-router';

type PostProps = {
  post: PostWithOwner;
  setSelectPost: (post: PostWithOwner | undefined) => void;
};

// create the posts row
const PostRow = (props: PostProps) => {
  const {post, setSelectPost} = props;
  const navigate = useNavigate();

  // select a single post from the post row
  const handlePostClick = async () => {
    setSelectPost(post);
    // navigate to the selected post
    navigate('/post', {state: {post}});
  };

  return (
    <article className=" bg-offwhite text-darkgreen my-1 shadow-xl h-70 sm:h-90 w-full md:max-w-200">
      <div className="m-2 mx-2 mb-0 flex justify-between items-center gap-2">
        <p className="w-25 h-10 flex items-center my-1 text-sm md:text-base">
          {post.city}, {post.country}
        </p>
        <Likes post={post} />
      </div>
      <article
        className="w-full h-3/4 sm:h-4/5 mt-2 px-2 cursor-pointer"
        onClick={handlePostClick}
      >
        <img
          className="object-cover h-full w-full"
          src={
            post.thumbnail ||
            (post.screenshots && post.screenshots[0]) ||
            undefined
          }
          alt={post.filename}
        />
      </article>
    </article>
  );
};

export default PostRow;
