/**
 * @api {get} /comments Get all comments
 * @apiName GetAllComments
 * @apiGroup Comment
 * @apiSuccess {Object[]} users List of comments.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No comments found"
 *     }
 */

/**
 * @api {get} /comments/:comment_id Get comment by ID
 * @apiName GetCommentById
 * @apiGroup Comment
 * @apiParam {Number} comment_id ID of the comment.
 * @apiSuccess {Object} comment Comment object.
 * HTTP/1.1 200 OK
 *     {
 *       "comment_id": 1,
 *       "post_id": 1,
 *       "user_id": 1,
 *       "comment_text": "Great post!",
 *       "created_at": "2025-01-15T12:00:00Z"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No comments found"
 *     }
 */

/**
 * @api {get} /comments/bypost/:post_id Get comments by post ID
 * @apiName GetCommentsByPostId
 * @apiGroup Comment
 * @apiParam {Number} post_id ID of the post.
 * @apiSuccess {Object[]} comments List of comments.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "comment_id": 1,
 *         "post_id": 1,
 *         "user_id": 1,
 *         "comment_text": "Great post!",
 *         "created_at": "2025-01-15T12:00:00Z"
 *       },
 *       {
 *         "comment_id": 2,
 *         "post_id": 1,
 *         "user_id": 2,
 *         "comment_text": "Thanks for sharing!",
 *         "created_at": "2025-01-16T12:00:00Z"
 *       }
 *     ]
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No comments found"
 *     }
 */

/**
 * @api {get} /comments/byuser Get comments by user ID
 * @apiName GetCommentsByUserId
 * @apiGroup Comment
 * @apiHeader {String} Authorization User's access token.
 * @apiSuccess {Object[]} comments List of comments.
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No comments found"
 *     }
*/

/**
 * @api {post} /comments Post a new comment
 * @apiName PostComment
 * @apiGroup Comment
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apibody {String} comment_text Text of the comment.
 * @apibody {Number} post_id ID of the post.
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Comment added"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal server error
 *     {
 *       "message": "Comment not created"
 *     }
 */

/**
 * @api {delete} /comments/:comment_id Delete a comment
 * @apiName DeleteComment
 * @apiGroup Comment
 * @apiPermission token
 * @apiHeader {String} Authorization User's access token.
 * @apiParam {Number} comment_id ID of the comment.
 * @apiSuccess {String} message Success message.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Comment deleted"
 *     }
 * @apiError {String} message Error message.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "message": "Comment not deleted"
 *     }
 */
