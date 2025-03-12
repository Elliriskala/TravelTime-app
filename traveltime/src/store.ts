import {Comment, Follow} from 'hybrid-types/DBTypes';
import {create} from 'zustand';

// commentstore type
type CommentStore = {
  comments: Partial<Comment & {username: string; profile_picture: string}>[];
  setComments: (
    comments: Partial<Comment & {username: string; profile_picture: string}>[],
  ) => void;
  addComment: (
    comment: Partial<Comment & {username: string; profile_picture: string}>,
  ) => void;
};

// followstore type
type FollowStore = {
  followers: Partial<Follow & {username: string; profile_picture: string}>[];
  followings: Partial<Follow & {username: string; profile_picture: string}>[];
  setFollowers: (
    followers: Partial<Follow & {username: string; profile_picture: string}>[],
  ) => void;
  setFollowings: (
    followings: Partial<Follow & {username: string; profile_picture: string}>[],
  ) => void;
  follow: (
    follower: Partial<Follow & {username: string; profile_picture: string}>,
  ) => void;
  unFollow: (follower_id: number) => void;
};

// use zustand to create a comment store
export const useCommentStore = create<CommentStore>((set) => ({
  // initial comments
  comments: [],
  setComments: (comments) =>
    set(() => ({
      // set the comments state
      comments: comments,
    })),
  addComment: (comment) =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          comment_id: state.comments.length + 1, // This is a temporary solution
          comment_text: comment.comment_text,
          user_id: comment.user_id,
          post_id: comment.post_id,
          created_at: new Date(),
          username: comment.username,
          profile_image: comment.profile_picture,
        },
      ],
    })),
}));

// use zustand to create a follow to manage followers adn followings
export const useFollowStore = create<FollowStore>((set) => ({
  // initial state for followers & followings
  followers: [],
  followings: [],
  // set the followers state
  setFollowers: (followers) =>
    set(() => ({
      followers: followers,
    })),
  // set the followings state
  setFollowings: (followings) =>
    set(() => ({
      followings: followings,
    })),
  follow: (
    follower: Partial<Follow & {username: string; profile_picture: string}>,
  ) =>
    // a new follower to the followers state
    set((state) => ({
      followers: [...state.followers, follower],
    })),
  unFollow: (follower_id) =>
    // remove a follower from the followers state
    set((state) => ({
      followers: state.followers.filter(
        (follower) => follower.follower_id !== follower_id,
      ),
    })),
}));
