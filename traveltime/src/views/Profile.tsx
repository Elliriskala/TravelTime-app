import {useEffect, useState} from 'react';
import NewPostForm from '../components/NewPostForm';
import BackButton from '../components/BackButton';
import PostRow from '../components/PostRow';
import {useFollow, useLike, useTravelPosts, useUser} from '../hooks/apiHooks';
import {PostWithOwner} from '../types/LocalTypes';
import {AiOutlinePicture} from 'react-icons/ai';
import {TbCameraPlus} from 'react-icons/tb';
import {HiOutlineHeart} from 'react-icons/hi';
import EditProfileForm from '../components/EditProfileForm';
import {UserWithNoPassword} from 'hybrid-types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import {useLocation, useNavigate} from 'react-router';
import {useFollowStore} from '../store';
import Followers from '../components/Followers';
import Followings from '../components/Followings';

// display user profiles
const Profile = () => {
  const {getUserById} = useUser();
  const [userProfile, setUserProfile] = useState<UserWithNoPassword | null>(
    null,
  );
  const [editprofile, setEditProfile] = useState(false);
  const [newPost, setNewPost] = useState(false);
  const [yourPosts, setYourPosts] = useState(true);
  const [likes, setLikes] = useState(false);
  const [userPosts, setUserPosts] = useState<PostWithOwner[]>([]);
  const [userLikes, setUserLikes] = useState<PostWithOwner[]>([]);
  const {getPostsByUser, getPostById} = useTravelPosts();
  const {getAllLikesByUserId} = useLike();
  const {postFollow, deleteFollow} = useFollow();
  const {follow, unFollow, followers, setFollowers, setFollowings} =
    useFollowStore();
  const {getFollowersByUserId, getFollowingsByUserId} = useFollow();
  const [profileDisplay, setProfileDisplay] = useState(true);
  const [followersDisplay, setFollowersDisplay] = useState(false);
  const [followingsDisplay, setFollowingsDisplay] = useState(false);
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {deleteUserAdmin} = useUser();
  const user_id = parseInt(useLocation().pathname.split('/')[2]);

  useEffect(() => {
    // fetch the user from the user id to display their profile
    const fetchUserProfile = async () => {
      if (user_id) {
        const fetchedUser = await getUserById(user_id);
        setUserProfile(fetchedUser);
      }
    };
    fetchUserProfile();
  }, [user_id]);

  useEffect(() => {
    // fetch posts by user id to display them in their profile
    const fetchUserPosts = async () => {
      if (userProfile) {
        const posts = await getPostsByUser(userProfile.user_id);
        setUserPosts(posts);
      }
    };

    fetchUserPosts();
  }, [userProfile]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (userProfile && token) {
      // get user's likes to display them in the profile
      const fetchUserLikes = async () => {
        try {
          // fetch all user likes bu user_id
          const likes = await getAllLikesByUserId(userProfile.user_id, token);
          if (!likes) {
            return null;
          }
          // extract the post id from the likes to create an array of the posts
          const postIds = likes.map((like) => like.post_id);

          // fetch the posts based on their id
          const likedPosts = await Promise.all(
            postIds.map(async (post_id) => {
              return await getPostById(post_id);
            }),
          );

          // filter out any null values
          const filteredPosts = likedPosts.filter(
            (post): post is PostWithOwner => post !== null,
          );

          // update the userlikes with the corresponding posts
          setUserLikes(filteredPosts);
        } catch (error) {
          console.error('Error fetching user likes:', error);
        }
      };

      fetchUserLikes();
    }
  }, [userProfile]);

  useEffect(() => {
    // fetch user's followings
    const fetchFollowings = async () => {
      if (userProfile) {
        const fetchedFollowings = await getFollowingsByUserId(
          userProfile.user_id,
        );
        setFollowings(fetchedFollowings);
      }
    };
    fetchFollowings();
  }, [userProfile]);

  useEffect(() => {
    // fetch user's followers
    const fetchFollowers = async () => {
      if (userProfile) {
        const fetchedFollowers = await getFollowersByUserId(
          userProfile.user_id,
        );
        setFollowers(fetchedFollowers);
      }
    };
    fetchFollowers();
  }, [userProfile]);

  useEffect(() => {
    // toggle the profile display
    setProfileDisplay(true);
    setFollowersDisplay(false);
    setFollowingsDisplay(false);
  }, [userProfile]);

  // follow a user
  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user || !userProfile) {
      return;
    }

    try {
      await postFollow(user.user_id, userProfile.user_id, token);
      follow({
        follower_id: user.user_id,
        following_id: userProfile.user_id,
        username: user.username,
        profile_picture: user.profile_picture || undefined,
      });
    } catch (error) {
      console.error('error following user:', (error as Error).message);
    }
  };

  // unfollow
  const handleUnfollow = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user || !userProfile) {
      return;
    }

    try {
      await deleteFollow(user.user_id, userProfile.user_id, token);
      unFollow(user.user_id);
    } catch (error) {
      console.error('Error unfollowing user:', (error as Error).message);
    }
  };

  // check if user follows another user
  const isFollowing = followers.some(
    (follower) => follower.follower_id === user?.user_id,
  );

  // toggle edit profile form
  const toggleEditProfile = () => {
    setEditProfile(!editprofile);
  };

  // delete user as admin
  const handleUserDeleteAdmin = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      await deleteUserAdmin(user_id, token);
      // on success navigate to login
      navigate('/');
    } catch (e) {
      console.error((e as Error).message);
      return;
    }
  };

  // if uploading new post or edit profile was executed successfully navigate back to user profile
  const handleDisplayOnSuccess = async () => {
    setNewPost(false);
    setYourPosts(true);
    setEditProfile(false);
    if (userProfile) {
      const userPosts = await getPostsByUser(userProfile.user_id);
      setUserPosts(userPosts);
      const userDetails = await getUserById(userProfile.user_id);
      setUserProfile(userDetails);
    }
  };

  return (
    <section className="flex w-full flex-col relative">
      {userProfile ? (
        <>
          {editprofile ? (
            <EditProfileForm
              ifUploadSuccess={handleDisplayOnSuccess}
              toggleEditProfile={toggleEditProfile}
            />
          ) : (
            <>
              <div className="bg-gradient-to-b from-transparent-blue to-blue w-full sm:w-4/5 md:w-3/5 md:max-w-140 m-auto mt-14 shadow-lg text-darkgreen z-10 flex gap-2 relative rounded-lg p-2 flex-col">
                <div className="absolute left-0 top-0 z-30 -mt-14 -mx-2">
                  <BackButton />
                </div>
                <div className="flex h-1/5 flex-row gap-2 items-center max-w-full mb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDisplay(true);
                      setFollowingsDisplay(false);
                      setFollowersDisplay(false);
                    }}
                    className="bg-offwhite p-2 rounded-lg transform-all duration-300 ease-in-out cursor-pointer transform hover:scale-101 active:scale-95 w-1/2 text-sm sm:text-base h-full font-bold"
                  >
                    {userProfile.username}
                  </button>
                  {user && user.user_id === userProfile.user_id ? (
                    <section className="flex gap-2 w-2/3 h-full">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDisplay(false);
                          setFollowingsDisplay(false);
                          setFollowersDisplay(true);
                        }}
                        className={`p-2 rounded-lg shadow-lg text-center transform-all duration-300 ease-in-out hover:bg-green hover:text-offwhite cursor-pointer transform hover:scale-105 active:scale-95 w-full text-sm sm:text-base ${
                          followersDisplay
                            ? 'bg-darkgreen text-lightblue'
                            : 'bg-blue'
                        }`}
                      >
                        Followers
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDisplay(false);
                          setFollowingsDisplay(true);
                          setFollowersDisplay(false);
                        }}
                        className={`p-2 rounded-lg shadow-lg text-center transform-all duration-300 ease-in-out hover:bg-green hover:text-offwhite cursor-pointer transform hover:scale-105 active:scale-95 w-full text-sm sm:text-base ${
                          followingsDisplay
                            ? 'bg-darkgreen text-lightblue'
                            : 'bg-blue'
                        }`}
                      >
                        Following
                      </button>
                    </section>
                  ) : (
                    <button
                      type="button"
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                      className="p-2 w-1/2 rounded-lg shadow-lg bg-blue text-center font-bold transform-all duration-300 ease-in-out hover:bg-green hover:text-offwhite cursor-pointer transform hover:scale-101 active:scale-95"
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </div>
                {profileDisplay ? (
                  <div className="flex flex-row gap-2 w-full">
                    <section className=" bg-offwhite h-50 sm:h-60 shadow-lg p-2 w-1/2">
                      <img
                        className="object-cover h-full w-full"
                        src={
                          'http://localhost:3002/uploads/' +
                            userProfile.profile_picture || undefined
                        }
                        alt="profile picture"
                      />
                    </section>
                    <div className="flex flex-col relative w-1/2">
                      <section className="flex bg-offwhite px-4 rounded-lg shadow-lg justify-center flex-col h-full">
                        <h2 className="font-light text-center my-1">
                          {' '}
                          Profile Info:
                        </h2>
                        <p className="text-center my-2">
                          {userProfile.profile_info}
                        </p>
                      </section>
                      {user && user.user_id === userProfile.user_id ? (
                        <button
                          type="button"
                          onClick={toggleEditProfile}
                          className="bg-lightblue p-2 rounded-lg shadow-lg transform-all duration-300 ease-in-out hover:bg-green font-bold hover:text-offwhite cursor-pointer transform hover:scale-101 active:scale-95 mt-2 text-sm sm:text-base"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        user &&
                        user.level_name === 'Admin' && (
                          <button
                            type="button"
                            onClick={handleUserDeleteAdmin}
                            className="bg-lightblue p-2 rounded-lg shadow-lg transform-all duration-300 ease-in-out hover:bg-green font-bold hover:text-offwhite cursor-pointer transform hover:scale-101 active:scale-95 mt-2 text-sm sm:text-base"
                          >
                            Delete User
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : followersDisplay ? (
                  <Followers />
                ) : followingsDisplay ? (
                  <Followings />
                ) : (
                  ''
                )}
              </div>
            </>
          )}
          <div className="flex flex-row w-full gap-1 sm:w-4/5 md:w-3/5 md:max-w-140 justify-center m-auto mt-2">
            {user && user.user_id === userProfile.user_id ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setYourPosts(!yourPosts);
                    setNewPost(false);
                    setLikes(false);
                  }}
                  className={`p-1 rounded-lg shadow-lg m-1 transform-all duration-300 ease-in-out w-full cursor-pointer flex flex-col-reverse sm:gap-2 sm:flex-row justify-center items-center ${
                    yourPosts
                      ? 'bg-darkgreen text-lightblue'
                      : 'bg-lightblue text-darkgreen hover:bg-offwhite'
                  }`}
                >
                  <AiOutlinePicture className="my-0.5" size={20} />
                  Your posts
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewPost(!newPost);
                    setYourPosts(false);
                    setLikes(false);
                  }}
                  className={`p-1 rounded-lg shadow-lg m-1 transform-all duration-300 ease-in-out w-full cursor-pointer flex flex-col-reverse sm:gap-2 sm:flex-row justify-center items-center ${
                    newPost
                      ? 'bg-darkgreen text-lightblue'
                      : 'bg-lightblue text-darkgreen hover:bg-offwhite '
                  }`}
                >
                  <TbCameraPlus className="my-0.5" size={20} />
                  New post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLikes(!likes);
                    setYourPosts(false);
                    setNewPost(false);
                  }}
                  className={`p-1 rounded-lg shadow-lg m-1 transform-all duration-300 ease-in-out w-full cursor-pointer flex flex-col-reverse sm:gap-2 sm:flex-row justify-center items-center ${
                    likes
                      ? 'bg-darkgreen text-lightblue'
                      : 'bg-lightblue text-darkgreen hover:bg-offwhite '
                  }`}
                >
                  <HiOutlineHeart className="my-0.5" size={20} />
                  Likes
                </button>
              </>
            ) : (
              <>
                <h1 className="font-bold mt-2">Posts</h1>
              </>
            )}
          </div>

          {newPost && <NewPostForm ifUploadSuccess={handleDisplayOnSuccess} />}
          {yourPosts && (
            <section className="grid grid-cols-2 gap-3 mt-6 md:max-w-140 m-auto w-full sm:w-4/5 md:w-3/5">
              {userPosts.map((post) => (
                <PostRow
                  key={post.post_id}
                  post={post}
                  setSelectPost={() => {}}
                />
              ))}
            </section>
          )}
          {likes && (
            <section className="grid grid-cols-2 gap-3 mt-6 md:max-w-140 m-auto w-full sm:w-4/5 md:w-3/5">
              {userLikes.map((post) => (
                <PostRow
                  key={post.post_id}
                  post={post}
                  setSelectPost={() => {}}
                />
              ))}
            </section>
          )}
        </>
      ) : (
        <p className="text-center">No user information available.</p>
      )}
    </section>
  );
};

export default Profile;
