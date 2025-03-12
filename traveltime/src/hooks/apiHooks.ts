import {
  UserWithNoPassword,
  Tag,
  TravelPost,
  Like,
  Comment,
  Follow,
} from 'hybrid-types/DBTypes';
import {fetchData} from '../lib/functions';
import {Credentials, RegisterCredentials} from '../types/LocalTypes';
import {
  AvailableResponse,
  LoginResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from 'hybrid-types/MessageTypes';
import {useEffect, useState} from 'react';
import {PostWithOwner} from '../types/LocalTypes';

const useAuthentication = () => {
  // login with credentials
  const postLogin = async (credentials: Credentials) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'},
    };
    try {
      return await fetchData<LoginResponse>(
        import.meta.env.VITE_AUTH_API + '/auth/login',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {Authorization: 'Bearer ' + token},
    };
    try {
      return await fetchData<UserResponse>(
        import.meta.env.VITE_AUTH_API + '/users/token',
        options,
      );
    } catch (error) {
      throw error as Error;
    }
  };

  // register a new user
  const postRegister = async (credentials: RegisterCredentials) => {
    const options = {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {'Content-Type': 'application/json'},
    };
    try {
      return await fetchData<UserResponse>(
        import.meta.env.VITE_AUTH_API + '/users',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  // update a user
  const updateUser = async (token: string, inputs: Record<string, string>) => {
    const options = {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };

    try {
      // send input to the auth server
      return await fetchData<UserResponse>(
        import.meta.env.VITE_AUTH_API + '/users/',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  // get all username to see its availability
  const getUsernameAvailable = async (username: string) => {
    return await fetchData<AvailableResponse>(
      import.meta.env.VITE_AUTH_API + '/users/username/' + username,
    );
  };

  // get all user emails to see its availability
  const getEmailAvailable = async (email: string) => {
    return await fetchData<AvailableResponse>(
      import.meta.env.VITE_AUTH_API + '/users/email/' + email,
    );
  };

  // get user by user_id
  const getUserById = async (user_id: number) => {
    // fetch from users with the user_id
    return await fetchData<UserWithNoPassword>(
      import.meta.env.VITE_AUTH_API + '/users/' + user_id,
    );
  };

  // delete user
  const deleteUser = async (token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_AUTH_API + '/users',
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  // delete user as admin
  const deleteUserAdmin = async (user_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_AUTH_API + '/users/' + user_id,
        options,
      );
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  return {
    getUserByToken,
    postRegister,
    updateUser,
    getUsernameAvailable,
    getEmailAvailable,
    getUserById,
    deleteUser,
    deleteUserAdmin,
  };
};

const useTags = () => {
  // fetch all tags from db
  const getTags = async () => {
    return await fetchData<Tag[]>(import.meta.env.VITE_POST_API + '/tags');
  };

  return {getTags};
};

const useTravelPosts = () => {
  const [postArray, setPostArray] = useState<PostWithOwner[]>([]);

  // get posts with their owner and associated tags
  const fetchPostWithOwner = async (
    post: TravelPost,
  ): Promise<PostWithOwner> => {
    // fetch the owner of the post
    const owner = await fetchData<UserWithNoPassword>(
      import.meta.env.VITE_AUTH_API + '/users/' + post.user_id,
    );

    // fetch the tags on the post
    const tags = await fetchData<{tag_name: string}[]>(
      import.meta.env.VITE_POST_API + '/tags/bypost/' + post.post_id,
    );

    return {
      ...post,
      username: owner.username,
      profile_picture: owner.profile_picture,
      tags: tags.map((tag) => tag.tag_name),
    };
  };

  useEffect(() => {
    // fetch all posts
    const getPosts = async () => {
      try {
        const posts = await fetchData<TravelPost[]>(
          import.meta.env.VITE_POST_API + '/posts',
        );

        // fetch the owner of the post
        const postsWithOwner: PostWithOwner[] = await Promise.all(
          posts.map(fetchPostWithOwner),
        );

        // set the posts to the explore page
        setPostArray(postsWithOwner);
      } catch (error) {
        console.error((error as Error).message);
      }
    };

    getPosts();
  }, []);

  // get the posts by destination
  const getPostsByDestination = async (destination: string) => {
    try {
      // fetch posts based on the destination selected
      const posts = await fetchData<TravelPost[]>(
        import.meta.env.VITE_POST_API + '/posts/bydestination/' + destination,
      );

      // fetch the owner and the tags of the post
      const postsWithDestinations: PostWithOwner[] = await Promise.all(
        posts.map(fetchPostWithOwner),
      );

      return postsWithDestinations;
    } catch (error) {
      console.error((error as Error).message);
      return [];
    }
  };

  // get the posts by tags
  const getPostsByTag = async (tag_name: string) => {
    try {
      // fetch posts based on the tag selected
      const posts = await fetchData<TravelPost[]>(
        import.meta.env.VITE_POST_API + '/posts/bytags/' + tag_name,
      );

      // fetch the owner and tags of the post
      const postsWithTags: PostWithOwner[] = await Promise.all(
        posts.map(fetchPostWithOwner),
      );

      return postsWithTags;
    } catch {
      // return empty array if no posts found by tag_name
      return [];
    }
  };

  // get a single post
  const getPostById = async (post_id: number) => {
    try {
      // fetch by id
      const post = await fetchData<TravelPost>(
        import.meta.env.VITE_POST_API + '/posts/' + post_id,
      );

      // fetch the owner and the tags
      const postWithOwner = await fetchPostWithOwner(post);
      return postWithOwner;
    } catch (error) {
      console.error((error as Error).message);
      return [];
    }
  };

  // get posts by user id to display them in their profile
  const getPostsByUser = async (user_id: number): Promise<PostWithOwner[]> => {
    try {
      // fetch posts based on the user id
      const posts = await fetchData<TravelPost[]>(
        import.meta.env.VITE_POST_API + '/posts/byuser/' + user_id,
      );

      // fetch the owner and the tags
      const postsWithOwner: PostWithOwner[] = await Promise.all(
        posts.map(fetchPostWithOwner),
      );

      return postsWithOwner;
    } catch {
      // return empty array if no posts by user id
      return [];
    }
  };

  // post a travelpost
  const postTravelPost = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    const post: Omit<
      TravelPost,
      'post_id' | 'user_id' | 'thumbnail' | 'created_at' | 'screenshots'
    > = {
      filename: file.data.filename,
      media_type: file.data.media_type,
      continent: inputs.continent,
      country: inputs.country,
      city: inputs.city,
      start_date: inputs.start_date,
      end_date: inputs.end_date,
      description: inputs.description,
      tags: inputs.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    };
    try {
      const postResponse = await fetchData<TravelPost>(
        import.meta.env.VITE_POST_API + '/posts',
        options,
      );
      return postResponse;
    } catch (error) {
      console.error('postTravelPost error:', error);
      throw error;
    }
  };

  // delete a travelpost
  const deleteTravelPost = async (post_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_POST_API + '/posts/' + post_id,
        options,
      );
      return response;
    } catch (error) {
      console.error('deleteTravelPost error:', error);
      throw error;
    }
  };

  return {
    postTravelPost,
    deleteTravelPost,
    getPostsByUser,
    getPostById,
    postArray,
    getPostsByDestination,
    getPostsByTag,
  };
};

const useFile = () => {
  // post a travelpost
  const postFile = async (file: File, token: string) => {
    // create FormData object
    const formData = new FormData();
    // add file to FormData
    formData.append('file', file);
    // upload the file to file server and get the file data, return the file data.
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token},
      body: formData,
    };
    try {
      return await fetchData<UploadResponse>(
        import.meta.env.VITE_UPLOAD_API + '/upload',
        options,
      );
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };

  // post a profile picture
  const postProfilePicture = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    // upload the profile picture to the file server
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token},
      body: formData,
    };
    try {
      return await fetchData<UploadResponse>(
        import.meta.env.VITE_UPLOAD_API + '/upload',
        options,
      );
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };
  return {postFile, postProfilePicture};
};

const useLike = () => {
  // like a post
  const postLike = async (post_id: number, token: string) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({post_id}),
    };
    try {
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_POST_API + '/likes',
        options,
      );
      return response;
    } catch (error) {
      console.error('postLike error:', error);
      throw error;
    }
  };

  // unlike a post
  const deleteLike = async (like_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const response = await fetchData<MessageResponse>(
        import.meta.env.VITE_POST_API + '/likes/' + like_id,
        options,
      );
      return response;
    } catch (error) {
      console.error('deleteLike error:', error);
      throw error;
    }
  };

  // get all user likes to display in their profile
  const getAllLikesByUserId = async (user_id: number, token: string) => {
    try {
      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      };

      // fetch the likes by user_id
      const likes = await fetchData<Like[]>(
        import.meta.env.VITE_POST_API + `/likes/byuser/${user_id}`,
        options,
      );

      return likes;
    } catch {
      // return empty array if no likes found by user_id
      return [];
    }
  };

  // get the count of likes by post_id
  const getCountByPostId = async (post_id: number) => {
    try {
      const response = await fetchData<{count: number}>(
        import.meta.env.VITE_POST_API + '/likes/count/' + post_id,
      );
      // return the count of the likes
      return response;
    } catch (error) {
      console.error('getCountByPostId error:', error);
      throw error;
    }
  };

  // get user like by post_id to check if user has already like the post
  const getUserLike = async (post_id: number, token: string) => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      const response = await fetchData<Like>(
        import.meta.env.VITE_POST_API + '/likes/bypost/user/' + post_id,
        options,
      );
      return response;
    } catch {
      // return null if no likes found on a post by user
      return null;
    }
  };

  return {
    postLike,
    deleteLike,
    getAllLikesByUserId,
    getCountByPostId,
    getUserLike,
  };
};

const useComment = () => {
  const {getUserById} = useUser();

  // post a new comment
  const postComment = async (
    post_id: number,
    user_id: number,
    profile_picture: string,
    comment_text: string,
    token: string,
  ) => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-type': 'application/json',
      },
      body: JSON.stringify({post_id, user_id, profile_picture, comment_text}),
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_POST_API + '/comments',
        options,
      );
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };

  // get all comments by post_id
  const getCommentsByPostId = async (post_id: number) => {
    try {
      // fetch all the comments on a post
      const comments = await fetchData<Comment[]>(
        import.meta.env.VITE_POST_API + '/comments/bypost/' + post_id,
      );
      // fetch the owner of the comment, with their username and profile picture
      const commentsWithUser = await Promise.all<
        Comment & {username: string; profile_picture: string}
      >(
        comments.map(async (comment) => {
          const user = await getUserById(comment.user_id);
          return {
            ...comment,
            username: user.username,
            profile_picture: user.profile_picture || '',
          };
        }),
      );
      return commentsWithUser;
    } catch {
      // return empty array if no comments found on a post
      return [];
    }
  };

  // delete a comment (either comment owner, post owner or admin)
  const deleteComment = async (comment_id: number, token: string) => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    try {
      return await fetchData<MessageResponse>(
        import.meta.env.VITE_POST_API + '/comments/' + comment_id,
        options,
      );
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };

  return {postComment, getCommentsByPostId, deleteComment};
};

const useFollow = () => {
  // get all followers by user id
  const getFollowersByUserId = async (user_id: number): Promise<Follow[]> => {
    const followersResponse = await fetchData<Follow[]>(
      `${import.meta.env.VITE_POST_API}/follow/followers/${user_id}`,
    );
    // return the followers
    return followersResponse;
  };

  // get all user followings by user id
  const getFollowingsByUserId = async (user_id: number): Promise<Follow[]> => {
    const followingsResponse = await fetchData<Follow[]>(
      `${import.meta.env.VITE_POST_API}/follow/followings/${user_id}`,
    );
    // return the followings of user
    return followingsResponse;
  };

  // follow a user
  const postFollow = async (
    follower_id: number,
    following_id: number,
    token: string,
  ): Promise<void> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      // get the follower_id & following_id from body
      body: JSON.stringify({follower_id, following_id}),
    };
    try {
      await fetchData<void>(`${import.meta.env.VITE_POST_API}/follow`, options);
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };

  // unfollow
  const deleteFollow = async (
    follower_id: number,
    following_id: number,
    token: string,
  ): Promise<void> => {
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({follower_id, following_id}),
    };
    try {
      await fetchData<void>(`${import.meta.env.VITE_POST_API}/follow`, options);
    } catch (error) {
      console.error((error as Error).message);
      throw error;
    }
  };

  return {
    getFollowersByUserId,
    getFollowingsByUserId,
    postFollow,
    deleteFollow,
  };
};

export {
  useAuthentication,
  useUser,
  useTags,
  useTravelPosts,
  useFile,
  useLike,
  useComment,
  useFollow,
};
