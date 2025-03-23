import BackButton from '../components/BackButton';
import {PostWithOwner} from '../types/LocalTypes';
import {Link, useLocation, useNavigate} from 'react-router';
import Likes from '../components/Likes';
import Comments from '../components/Comments';
import {useUserContext} from '../hooks/contextHooks';
import {useTravelPosts} from '../hooks/apiHooks';

// display a single post
const Post = () => {
  const {user} = useUserContext();
  const {state} = useLocation();
  const post: PostWithOwner = state?.post;
  const {deleteTravelPost} = useTravelPosts();
  const navigate = useNavigate();

  if (!post) {
    return <div>Loading...</div>;
  }

  // get the dates of the trip to display them in the post
  const startDate = new Date(post.start_date);
  const endDate = new Date(post.end_date);

  const endDateString = endDate.toLocaleDateString('fi-FI', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  // if same year, only display the year on the end date
  const startDateString = startDate.toLocaleDateString('fi-FI', {
    year:
      endDate.getFullYear() === startDate.getFullYear() ? undefined : 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  // delete post (post owner or admin)
  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      await deleteTravelPost(post.post_id, token);
      navigate(-1);
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-darkgreen w-full m-auto sm:max-w-150 relative mt-12">
      <div className="absolute left-0 top-0 -mx-3 -mt-12">
        <BackButton />
      </div>
      <div className="w-full h-auto bg-offwhite shadow-lg m-auto my-2 p-1">
        <div className="flex flex-row justify-between px-2 my-1">
          <p className="text-left font-bold text-sm md:text-base">
            {post.city}, {post.country} <br></br> {post.continent}
          </p>
          <p className=" font-bold text-green text-sm md:text-base mt-6">
            {startDateString} - {endDateString}
          </p>
        </div>
        <section className="mx-2 my-1">
          {post &&
            (post.media_type.includes('video') ? (
              <video
                className="h-100 sm:h-120 w-full object-cover m-auto"
                controls
                src={`${post.filename}`}
              ></video>
            ) : (
              <div>
                <img
                  className="m-auto h-100 sm:h-120 w-full object-cover"
                  src={`${post.filename}`}
                  alt={post.filename}
                />
              </div>
            ))}
        </section>
        <div className="flex flex-row justify-between items-center gap-2 p-1 mx-1">
          <section className="flex gap-2 items-center">
            <Link to={`/profile/${post.user_id}`}>
              <img
                src={
                  post
                    ? 'https://ucad-server-https.northeurope.cloudapp.azure.com/upload/uploads/' + post.profile_picture
                    : undefined
                }
                alt="profile picture"
                className="w-10 h-10 object-cover rounded-full"
              />
            </Link>
            <Link to={`/profile/${post.user_id}`}>
              <p className="font-bold">{post.username}</p>
            </Link>
          </section>
          <Likes post={post} />
        </div>
        <div className="bg-gradient-to-b from-lightblue to-blue rounded-sm shadow-lg p-1 relative text-darkergreen m-2">
          <p className="right-1 text-sm absolute z-10 m-1">
            {new Date(post.created_at).toLocaleDateString('fi-FI')}
          </p>
          <p className="p-2 m-1 mt-5 rounded-lg">{post.description}</p>
          <div className="flex flex-wrap gap-2 p-2 font-light justify-end">
            {post.tags &&
              post.tags.map((tag_name: string, index: number) => (
                <span
                  key={index}
                  className="text-sm bg-lightblue px-2 rounded-lg shadow-lg"
                >
                  #{tag_name}
                </span>
              ))}
          </div>
        </div>
        {user &&
          (user.user_id === post.user_id || user.level_name === 'Admin') && (
            <section className="flex justify-end m-2 mt-3">
              <button
                type="button"
                onClick={handleDeletePost}
                className="rounded-4xl bg-blue text-darkergreen px-3 p-1 transition-all text-sm duration-500 ease-in-out hover:bg-darkgreen shadow-lg hover:text-offwhite cursor-pointer transform hover:scale-105 active:scale-95"
              >
                Delete
              </button>
            </section>
          )}
      </div>
      <Comments post={post} />
    </div>
  );
};

export default Post;
