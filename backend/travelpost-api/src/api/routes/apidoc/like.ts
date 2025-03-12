/**
 * @api {get} /likes Get all likes
 * @apiName GetAllLikes
 * @apiGroup Like
 * @apiSuccess {Object[]} likes List of likes.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "post_id": 1,
 *         "user_id": 1,
 *         "created_at": "2025-01-15T12:00:00Z"
 *       },
 *       {
 *         "like_id": 2,
 *         "post_id": 2,
 *         "user_id": 2,
 *         "created_at": "2025-01-16T12:00:00Z"
 *       }
 *     ]
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {get} /likes/bypost/:post_id Get likes by post ID
 * @apiName GetLikesByPostId
 * @apiGroup Like
 * @apiParam {Number} post_id ID of the post.
 * @apiSuccess {Object[]} likes List of likes.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "post_id": 1,
 *         "user_id": 1,
 *         "created_at": "2025-01-15T12:00:00Z"
 *       },
 *       {
 *         "like_id": 2,
 *         "post_id": 1,
 *         "user_id": 2,
 *         "created_at": "2025-01-16T12:00:00Z"
 *       }
 *     ]
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {get} /likes/byuser/:user_id Get likes by user ID
 * @apiName GetLikesByUserId
 * @apiGroup Like
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiParam {Number} user_id ID of the user.
 * @apiSuccess {Object[]} likes List of likes.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "like_id": 1,
 *         "post_id": 1,
 *         "user_id": 1,
 *         "created_at": "2025-01-15T12:00:00Z"
 *       },
 *       {
 *         "like_id": 2,
 *         "post_id": 2,
 *         "user_id": 1,
 *         "created_at": "2025-01-17T12:00:00Z"
 *       }
 *     ]
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {get} /likes/bypost/user/:post_id Get like by post ID and user ID
 * @apiName GetLikeByPostIdAndUserId
 * @apiGroup Like
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiParam {Number} post_id ID of the post.
 * @apiSuccess {Object} like Like object.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "like_id": 1,
 *       "post_id": 1,
 *       "user_id": 1,
 *       "created_at": "2025-01-15T12:00:00Z"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No likes found"
 *     }
 */

/**
 * @api {get} /likes/count/:post_id Get likes count by post ID
 * @apiName GetLikesCountByPostId
 * @apiGroup Like
 * @apiParam {Number} post_id ID of the post.
 * @apiSuccess {Number} count Number of likes.
 * * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "count": 42
 *     }
 */

/**
 * @api {post} /likes Like a post
 * @apiName LikePost
 * @apiGroup Like
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apibody {Number} post_id ID of the post.
 * @apiSuccess {String} message Success message.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "Like not created"
 *     }
 */

/**
 * @api {delete} /likes/:post_id Unlike a post
 * @apiName UnlikePost
 * @apiGroup Like
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiParam {Number} post_id ID of the post.
 * @apiSuccess {String} message Success message.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "Like not deleted"
 *     }
 */
