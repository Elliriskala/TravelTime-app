import {Like} from 'hybrid-types/DBTypes';
import {useEffect, useReducer} from 'react';
import {useLike} from '../hooks/apiHooks';
import {PostWithOwner} from '../types/LocalTypes';
import {HiHeart, HiOutlineHeart} from 'react-icons/hi';

type LikeState = {
  count: number;
  userLike?: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

// set initial state for likes
const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      return {...state, userLike: action.like ?? null};
    default:
      return state;
  }
};

const Likes = ({post}: {post: PostWithOwner}) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {postLike, deleteLike, getCountByPostId, getUserLike} = useLike();

  // get user like
  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!post || !token) {
      return;
    }
    try {
      const userLike = await getUserLike(post.post_id, token);

      // return userlike or null if no userlike
      likeDispatch({type: 'like', like: userLike});
    } catch {
      likeDispatch({type: 'like', like: null});
      return;
    }
  };

  // get like count by post_id
  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByPostId(post.post_id);
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch {
      likeDispatch({type: 'setLikeCount', count: 0});
      return;
    }
  };

  // get the likes and the likes count
  useEffect(() => {
    getLikes();
    getLikeCount();
  }, []);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!post || !token) {
        return;
      }
      // If user has liked the media, delete the like. Otherwise, post the like.
      if (likeState.userLike) {
        // delete the like and dispatch the new like count to the state. Dispatching is already done in the getLikes and getLikeCount functions.
        await deleteLike(likeState.userLike.like_id, token);
        likeDispatch({type: 'like', like: null});
        likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
      } else {
        // post the like and dispatch the new like count to the state. Dispatching is already done in the getLikes and getLikeCount functions.
        await postLike(post.post_id, token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.error('like error', (e as Error).message);
    }
  };

  return (
    <>
      <div className="rounded-4xl p-1 px-2 bg-lightblue w-15 text-center h-8 md:h-10 flex items-center justify-center gap-1">
        <button type="button" onClick={handleLike}>
          {likeState.userLike ? (
            <HiHeart className="cursor-pointer text-darkgreen" size={20} />
          ) : (
            <HiOutlineHeart
              className="cursor-pointer text-darkgreen
            "
              size={18}
            />
          )}
        </button>
        <p>{likeState.count}</p>
      </div>
    </>
  );
};

export default Likes;
