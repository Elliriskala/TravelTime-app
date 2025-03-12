/**
 * @api {get} /follow/followers/:user_id Get all followers of a user
 * @apiName GetAllFollowers
 * @apiGroup Follow
 * @apiPermission token
 * @apiParam {Number} user_id User's unique ID.
 * @apiSuccess {Object[]} followers List of followers.
 * @apiSuccess {Number} followers.follower_id Follower's unique ID.
 * @apiSuccess {String} followers.username Follower's username.
 * @apiSuccess {String} followers.profile_picture Follower's profile picture.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "follower_id": 1,
 *         "username": "john_doe",
 *         "profile_picture": "profile1.jpg"
 *       },
 *       {
 *         "follower_id": 2,
 *         "username": "jane_doe",
 *         "profile_picture": "profile2.jpg"
 *       }
 *     ]
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "Failed to fetch followers"
 *     }
 */

/**
 * @api {get} /follow/followings/:user_id Get all followings of a user
 * @apiName GetAllFollowings
 * @apiGroup Follow
 * @apiPermission token
 * @apiParam {Number} user_id User's unique ID.
 * @apiSuccess {Object[]} followings List of followings.
 * @apiSuccess {Number} followings.following_id Following's unique ID.
 * @apiSuccess {String} followings.username Following's username.
 * @apiSuccess {String} followings.profile_picture Following's profile picture.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "following_id": 1,
 *         "username": "john_doe",
 *         "profile_picture": "profile1.jpg"
 *       },
 *       {
 *         "following_id": 2,
 *         "username": "jane_doe",
 *         "profile_picture": "profile2.jpg"
 *       }
 *     ]
 */

/**
 * @api {post} /follow Follow a new user
 * @apiName FollowUser
 * @apiGroup Follow
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiBody {Number} follower_id Follower's unique ID.
 * @apiBody {Number} following_id Following's unique ID.
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Follower added"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "Following failed"
 *     }
 */

/**
 * @api {delete} /follow Unfollow a user
 * @apiName UnfollowUser
 * @apiGroup Follow
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiBody {Number} follower_id Follower's unique ID.
 * @apiBody {Number} following_id Following's unique ID.
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User unfollowed"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "Unfollowing failed"
 *     }
 */
