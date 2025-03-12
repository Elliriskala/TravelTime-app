export const ERROR_MESSAGES = {
  TRAVELPOST: {
    NOT_FOUND: 'No posts found',
    NOT_FOUND_USER: 'No posts found for user',
    NOT_FOUND_LIKED: 'No liked posts found',
    NOT_CREATED: 'Failed to create a post',
    NOT_UPDATED: 'Post not updated',
    NOT_DELETED: 'Post not deleted',
    NOT_AUTHORIZED: 'Not authorized to delete post',
    NO_ID: 'No id provided',
    NO_TAGS: 'No tags provided',
  },
  LIKE: {
    NOT_FOUND: 'No likes found',
    NOT_FOUND_MEDIA: 'No likes found for media',
    NOT_FOUND_USER: 'No likes found for user',
    NOT_CREATED: 'Like not created',
    NOT_DELETED: 'Like not deleted',
    ALREADY_EXISTS: 'User has already liked this media item',
  },
  TAG: {
    NOT_FOUND: 'No tags found',
    NOT_FOUND_MEDIA: 'No tags found for media',
    NOT_CREATED: 'Tag not created',
    NOT_DELETED: 'Tag not deleted',
    NOT_AUTHORIZED: 'Not authorized to modify tags',
    FILES_NOT_FOUND: 'No files found with this tag',
  },
  COMMENT: {
    NOT_FOUND: 'No comments found',
    NOT_FOUND_MEDIA: 'No comments found for media',
    NOT_FOUND_USER: 'No comments found for user',
    NOT_CREATED: 'Comment not created',
    NOT_DELETED: 'Comment not deleted',
    NOT_UPDATED: 'Comment not updated',
    NO_ID: 'No comment id provided',
  },
  FOLLOW: {
    NOT_FOUND_FOLLOWERS: 'No followers found',
    NOT_FOUND_FOLLOWINGS: 'No follings found',
    NOT_CREATED: 'Following failed',
    NOT_DELETED: 'Unfollowing failed',
    ALREADY_EXISTS: 'User already following this user'
  }
} as const;
